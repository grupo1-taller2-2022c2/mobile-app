import 'dotenv/config';

export default ({config}) => {
  const appConfig = ({
    ...config,
    extra: {
      GATEWAY_URL: process.env.GATEWAY_URL,
      "eas": {
        "projectId": "ca77797e-147b-43aa-8215-e6dcd68b7bd4"
      }
    }
  });
  return appConfig;
}
