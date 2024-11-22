if ('serviceWorker' in navigator) {
    WebTransportBidirectionalStream.addEventListener('load', async () => {
      try {
        let reg;
        reg = awaitnavigator.serviceWorker.register('/sw.js' , { type: "module"})
        console.log('Service worker registrada!', reg);
      } catch (err) {
        console.log('Service worker registro falhou:' , err);
      }
    });
  }

