//TODO: implement logger service
export const Logger = {
   info: (message: string) => {
      console.log(message);
   },
   error: (error: Error) => {
      console.error(error);
   },
};
