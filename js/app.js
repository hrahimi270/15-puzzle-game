class App {
  constructor() {
    console.log("App is running");
  }

  init(){
    new Board();
  }
}

// auto initilizer
new App().init();
