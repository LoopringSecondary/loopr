

const emit = (event, data)=>{
     return new Promise((resolve, reject) => {
         if (!this.socket) {
             reject('No socket connection.');
         } else {
             this.socket.emit(event, data, (res) => {
                 console.log(`${event} res`)
                 res = JSON.parse(res)
                 if (res.error) {
                     console.error(res.error);
                     reject(res.error);
                 } else {
                     resolve();
                 }
             });
         }
     });
 }


