const horizon = new Horizon({
});
const posts = horizon('posts');
const users = horizon('users');

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
              <li class="navbar-right"><a id="login-button" href="#login" @click="showLoginForm">Log In</a></li>
            </ul>
          </template>
        </div><!--/.nav-collapse -->
      </div>
    </nav>

    <div id="login-form">
      <label for="login-username">Username</label><input type="text" id="login-username" name="login-username" /><br>
      <label for="login-password">Password</label><input type="password" id="login-password" name="login-password" @keyup.enter="logMeIn" /><br>
      <button @click="logMeIn" @keyup.space="logMeIn">Log In</button>
    </div>

    <div>
      <div id="chatMessages">
        <ul>
          <li v-for="message in posts">
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
    posts: [],
    userAuthenticated: false,
    user: null,
    characterName: ''
  },
  created() {
    // Subscribe to messages
    // does not require authentication to watch
    posts.order('datetime', 'descending').limit(10).watch()
    .subscribe(allPosts => {
        // Make a copy of the array and reverse it, so newest images push into
        // the messages feed from the bottom of the rendered list. (Otherwise
        // they appear initially at the top and move down)
        this.posts = [...allPosts].reverse()
      },
      // When error occurs on server
      error => console.log(error)
    )

    // Triggers when client successfully connects to server
    horizon.onReady().subscribe(
      () => {
        console.log("Connected to Horizon server");
      }
    )

    // Triggers when disconnected from server
    horizon.onDisconnected().subscribe(
      () => console.log("Disconnected from Horizon server")
    )
  },
  methods: {
    sendMessage(event) {
      posts.store({
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
    },
    showLoginForm(event) {
      console.log('login clicked', event);
      var loginForm = $('#login-form');
      var loginButton = $('#login-button');
      var buttonPosition = loginButton[0].getBoundingClientRect();

      loginForm.css({
        'top': (buttonPosition.bottom + 3) +'px',
        'right': '0px'
      }).show();
    },
    logMeIn(event) {
      var username = $('#login-username').val();
      var password = $('#login-password').val();
      console.log('loggin in', username, password);

    }
  }
});
