import { Box } from '@skynexui/components';
import appConfig from '../../config.json';

const DiscordBox = ({ children }) => {
  return (
    <Box
        styleSheet={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: appConfig.theme.colors.custom[100],
          // backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)',
          backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        }}
      >
        {children}
    </Box>
  );
};

export default DiscordBox;