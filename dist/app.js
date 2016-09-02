const horizon = new Horizon();
const messages = horizon('messages');

const app = new Vue({
  el: '#app',
  template: `
    <template v-if="!userAuthenticated">
      <div class="container text-center">
        <img src="../img/NWRP_Logo_Scarlet.png" alt="New Worlds Roleplay" />
      </div>
    </template>
    <nav class="navbar navbar-inverse">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a v-if="userAuthenticated" class="navbar-brand" href="#">New Worlds RP</a>
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#games">Our Games</a></li>
            <li><a href="#chat">Chat</a></li>
            <li><a href="#contact">Contact</a></li>
            <template v-if="userAuthenticated">
              <li><a href="#logout">Log Out</a></li>
            </template>
          </ul>
          <template v-if="userAuthenticated">
            <form class="navbar-form navbar-right">
              <div class="form-group">
                Character:
                <select class="form-control" placeholder="Choose a character">
                  <option value="1">Char 1</option>
                  <option value="2">Char 2</option>
                  <option value="3">Char 3</option>
                  <option value="4">Char 4</option>
                </select>
              </div>
            </form>
          </template>
          <template v-else>
            <ul class="nav navbar-nav navbar-right">
              <li class="navbar-right"><a href="#login">Log In</a></li>
            </ul>
          </template>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div>
      <div id="chatMessages">
        <ul>
          <li v-for="message in messages">
            {{ message.text }}
          </li>
        </ul>
      </div>
      <div id="input">
        <input @keyup.enter="sendMessage" ></input>
      </div>
    </div>
  `,
  data: {
    // Our dynamic list of chat messages
    messages: [],
    userAuthenticated: false
  },
  created() {
    // Subscribe to messages
    messages.order('datetime', 'descending').limit(10).watch()
    .subscribe(allMessages => {
        // Make a copy of the array and reverse it, so newest images push into
        // the messages feed from the bottom of the rendered list. (Otherwise
        // they appear initially at the top and move down)
        this.messages = [...allMessages].reverse()
      },
      // When error occurs on server
      error => console.log(error)
    )

    // Triggers when client successfully connects to server
    horizon.onReady().subscribe(
      () => console.log("Connected to Horizon server")
    )

    // Triggers when disconnected from server
    horizon.onDisconnected().subscribe(
      () => console.log("Disconnected from Horizon server")
    )
  },
  methods: {
    sendMessage(event) {
      messages.store({
        text: event.target.value, // Current value inside <input> tag
        datetime: new Date() // Warning clock skew!
      }).subscribe(
          // Returns id of saved objects
          result => console.log(result),
          // Returns server error message
          error => console.log(error)
        )
        // Clear input for next message
        event.target.value = ''
    }
  }
});
