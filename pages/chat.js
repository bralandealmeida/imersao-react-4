import React, { useState, useEffect } from 'react';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import appConfig from '../config.json';
import DiscordBox from '../components/Box';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import Skeleton from 'react-loading-skeleton';
import { ButtonSendSticker } from '../components/ButtonSendSticker';
// import * as HoverCard from '@radix-ui/react-hover-card';

export default function ChatPage() {
    const router = useRouter();
    const loggedUser = router.query.username;

    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    function handleNewMessage(newMessage) {
      if(newMessage < 1){
        return;
      }

      const message = {
        from: loggedUser,
        text: newMessage,
      };

      supabase.from('messages').insert([ message ])
      .then(({data }) => {
        setMessageList([
            data[0],
            ...messageList,
          ]);
      });

    //   setMessageList([
    //     message,
    //     ...messageList,
    //   ]);

      setMessage('');
    }

    async function handleRemoveMessage(id) {
        await supabase.from('messages').delete().match({ id: id });
        const newMessageList = messageList.filter(((message) => message.id !== id));
        setMessageList(newMessageList);
    }

    function listenRealTimeMessages(addNewMessage){
        return supabase.from('messages').on('INSERT', (response) => {
            addNewMessage(response.new);
        }).subscribe();
    }

    useEffect(() => {
        if(!loggedUser){
            router.push('/');
        }
    } ,[loggedUser]);

    useEffect(() => {
        try{
            supabase.from('messages').select('*').order('created_at', { ascending: false })
            .then(({ data }) => setMessageList(data));
            
            listenRealTimeMessages((newMessages) => setMessageList([ newMessages, ...messageList ]));
        }catch(error){
            console.log(error);
        }
    }, []);

    return (
        <DiscordBox>
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList messages={messageList} handleRemoveMessage={handleRemoveMessage} />
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNewMessage(message);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <ButtonSendSticker
                            onStickerClick={(sticker) => handleNewMessage(`:sticker:${sticker}`)}
                        />
                        <Button
                            variant='tertiary'
                            styleSheet={{
                              marginBottom: '6px',
                              backgroundColor: appConfig.theme.colors.neutrals[800],
                              hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                              },
                              focus: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                              }
                            }}
                            iconName="FaArrowCircleRight"
                            size="lg"
                            onClick={() => {
                              handleNewMessage(message);
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </DiscordBox>
    )
}

const Header = () => {
  const router = useRouter();

  return (
    <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
            Chat
        </Text>
        <Button
            variant='tertiary'
            colorVariant='neutral'
            label='Logout'
            onClick={() => router.push('/')}
        />
    </Box>
  )
}

const MessageList = ({ messages, handleRemoveMessage }) => {
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {messages.length === 0 ? (
                <>
                    <li><Skeleton height={32} /></li>
                    <li><Skeleton height={32} /></li>
                    <li><Skeleton height={32} /></li>
                </>
            ) : messages.map((message) => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            
                            <Text tag="strong">
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Button
                              label="Excluir"
                              colorVariant='neutral'
                              styleSheet={{
                                marginLeft: '8px',
                              }}
                              size='xs'
                              onClick={() => handleRemoveMessage(message.id)}
                            />
                        </Box>
                        {message.text.startsWith(':sticker:') ? (
                            <Image src={message.text.replace(':sticker:', '')} />
                        ) : (
                            message.text
                        )}
                    </Text>
                );
            })}
        </Box>
    )
}