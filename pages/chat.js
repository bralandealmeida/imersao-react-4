import React, { useState } from 'react';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import appConfig from '../config.json';
import DiscordBox from '../components/Box';
import { useRouter } from 'next/router';

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    function handleNewMessage(newMessage) {
      if(newMessage < 1){
        return;
      }

      const message = {
        id: messageList.length + 1,
        from: 'vanessametonini',
        text: newMessage,
      };

      setMessageList([
        message,
        ...messageList,
      ]);

      setMessage('');
    }

    function handleRemoveMessage(id) {
      const newMessageList = messageList.filter(((message) => message.id !== id));
      setMessageList(newMessageList);
    }

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
            {messages.map((message) => {
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
                                src={`https://github.com/vanessametonini.png`}
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
                        {message.text}
                    </Text>
                );
            })}
        </Box>
    )
}