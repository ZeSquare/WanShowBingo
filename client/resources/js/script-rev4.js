$(function() {

  //define cache key
  const CACHE_KEY = 'bingo-card'; // Define the cache key

   // Fetch max users from server
   fetch('https://socket.wanshow.bingo/maxUsers', { credentials: 'include' })
   .then(response => {
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     return response.json();
   })
   .then(data => {
     const date = new Date(data.date);
     const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
     document.getElementById('max-users').textContent = `Max User Count: ${data.maxUsers} Users Online on ${formattedDate}`;
   })
   .catch(error => {
     console.error('Fetch request failed:', error);
   });

  //WEB SOCKETS
     // const socket = io('https://socket.wanshow.bingo');

     // socket.on("updateCount", function (msg) {
     //   document.getElementById('playerCount').innerHTML = msg
     // });
    // const socket = io.connect("https://socket.wanshow.bingo/socket.io/");

     //socket.on("connect", () => {
     //  console.log("Connected to secure websocket server.");
     //});

     //socket.on("message", (data) => {
     //  const parsedData = JSON.parse(data);
     //  $("#liveUserCount").text(`Live players: ${parsedData.liveUsers}`);
     //});
     const socket = io('https://socket.wanshow.bingo:3000');

     socket.on('connect', () => {
       console.log('Connected to the server');
     });

    // socket.on('liveUsers', (data) => {
    //   const liveUsersElement = document.getElementById('live-users');
    //  liveUsersElement.textContent = `Live Bingo Players : ${data.liveUsers}`;
    // });

    socket.on('liveUsers', (data) => {
      const liveUsersElement = document.getElementById('live-users');
      liveUsersElement.classList.add('user-count');
      liveUsersElement.textContent = "Current Live Users: " + data.liveUsers;
    });

     socket.on('disconnect', () => {
       console.log('Disconnected from the server');
     });
  //Populate
  const entries = [
    "Dan complains about fingers",
    "Wish.com items suck",
    "Linus or Luke or Dan sighs",
    "Linus ignores Luke to change the topic",
    "Linus hates on Twitch Chat",
    "Linus Facepalms",
    "Intro/Outro run accidentally",
    "The microphone gets hit",
    "*Wow, I feel old...*",
    "Camera Not Focused",
    "Luke was Wrong",
    "Linus Was Wrong",
    "Colton Quit / Fired joke",
    "Linus Drops Something",
    "Nvidia News!",
    "AMD News!",
    "Intel News!",
    "Apple News!",
    "New Sponsor!",
    "Screenshare has No Audio",
    "Audio Clipping",
    "Literally one super topic until sponsor spot",
    "Linus leaves the other host alone",
    "Video output not connected to laptop",
    "Console Topic for the peasantry",
    "Luke says *That's Hilarious!*",
    "Linus has 2 phones on his person",
    "Someone messes with the set",
    "Linus: 'We've got a great show for you today!'",
    "Audio suddenly too quiet/loud",
    "No actual news before sponsor spot",
    "Linus doesn't censor while swearing",
    "Motion-Sickness Camera",
    "Super-Zoomed Camera",
    "Hello Dan",
    "LTT Store Plug",
    "LTT Water Bottle drank from",
    "Banana For Scale",
    "Linus Hot Take",
    "Linus Roasts a Company",
    "Linus' parenting stories",
    "Mispronunciation of a word/phrase",
    "Rapid-fire sponsor reads",
    "Stream Dies",
    "Costumes!",
    "4+ Hour WAN Show (What a Champ!)",
    "Luke laughs uncomfortably loud",
    "Linus leaks a product early",
    "Luke talks about AI",
    "Luke teases a new floatplane feature",
    "Accidentally shared confidential info",
    "Dan ignores Linus",
    "Hit me Dan",
    "WANShow.bingo is mentioned",
    "Not my problem anymore, talk to the new ceo.",
    "Linus: it's not my fault",
    "Sponsored by dbrand!",
    "Sponsored by SquareSpace!",
    "Linus eats/drinks something",
    "Linus complains about YouTube",
    "Live Tech Product Unboxing",
    "Talking over Audio",
    "WAN After Dark",
    "Disarm the Alarm!",
    "Trust me Bro",
    "Linus is out of touch",
    "Too long (15 min+) on a topic",
    "Too long (5 mins+) on a merch message",
    "Inuendo",
    "*oh yeah I guess we should do sponsor spots*",
    "Linus rants while Luke interacts with chat bored",
    "Linus changes camera angle for dan 'I've got it'",
    "Linus: 'Since you put me on the spot'",
    "New merch launch",
    "Putting off Merch Messages 'We'll get them in a sec'",
    "DAN tries to talk but is muted",
    "DING",
    "Dennis overboard sponsorspot",
    "Linus gets signed out of Google Docs",
    "Going back to previous topic/merch message",
    "*The Hackening*",
    "Luke struggles to pick a topic",
    "Anyone but LLD turn up on set",
    "*Spicy Take*",
    "Dan cam with no Dan",
    "Dan goes and gets snacks for Linus",
    "Linus reaches out to Nick afterhours",
    "Luke talks about his healthy lifestyle",
    "Linus 'turns off' Dan",
    "Xmas album mention",
    "Linus Theft Tips",
    "*Where was I going with this?*",
    "Luke doing a concern", //use this image as square background if possible
    "Linus rants for over 2 mins without input from Luke",
    "Dan goes AFK",
    "Billet Labs mentioned",
    "Mentions another creator",
    "Linus says: 'Look, the thing is'"
  ];

  const staticEntries = [];
  staticEntries.push(...entries);

  // Retrieve cached bingo card or generate a new one
  let spaces = JSON.parse(localStorage.getItem(CACHE_KEY));
  let clickedTiles = []; // Define clickedTiles array
  if (!spaces) {
    spaces = generateRandomBingoCard(entries);
    localStorage.setItem(CACHE_KEY, JSON.stringify(spaces));
  } else {
    // Restore clicked tiles from localStorage
    clickedTiles = JSON.parse(localStorage.getItem("clickedTiles")) || [];
    clickedTiles.forEach(index => {
    });
  }

  // Draw the board
  const board = $("#board");
  for (let i = 0; i < spaces.length; i++) {
    const boardTile = document.createElement('div');
    boardTile.classList.add('item');
    if (i === 12 || clickedTiles.includes(i)) {
      boardTile.classList.add('clicked');
    }
    const tileText = document.createElement('p');
    tileText.innerText = spaces[i];
    boardTile.appendChild(tileText);
    board.append(boardTile);
  }

  function generateRandomBingoCard(entries) {
    const card = [];
    for (let i = 0; i < 25; i++) {
      if (i === 12) {
        card[i] = "***Free Space*** \n\n Late";
      } else {
        if (entries.length == 0) {
            entries.push(...staticEntries);
          }
        const choice = Math.floor(Math.random() * entries.length);
        card[i] = entries[choice];
        entries.splice(choice, 1);
      }
    }
    return card;
  }

  // Refresh button functionality
  $("#refreshButton").click(function() {
    localStorage.removeItem("clickedTiles");
    clickedTiles = []; // Clear clickedTiles array
    spaces = generateRandomBingoCard(entries);
    localStorage.setItem(CACHE_KEY, JSON.stringify(spaces));

    // Update the displayed bingo card
    const boardTiles = $(".item");
    boardTiles.each(function(index) {
      if(index != 12) {
        const tileText = $(this).find('p');
        tileText.text(spaces[index]);
        $(this).removeClass('clicked');
      }
    });

    loser();
  });

  //hide / unhide twitch
  $("#hideTwitch").click(function() {
    $("#stream").toggle();
    $("#game").toggleClass("toggledWide");
    if($("#hideTwitch").html() === "Hide Twitch") {
      $(this).html("Show Twitch");
    } else {
      $(this).html("Hide Twitch");
    }
  });

  // Theme selector change event
  $("#themeSelector").change(function() {
    const selectedTheme = $(this).val();
    const body = $("body");
    if (selectedTheme === "original") {
        //body.removeClass("bread-theme").addClass("original-theme");
        $(".title img").attr("src", "./resources/images/wanshowbingo-w.png");
        $("title").text("WAN SHOW BINGO!");
    } else if (selectedTheme === "bread") {
        //body.removeClass("original-theme").addClass("bread-theme");
        $(".title img").attr("src", "./resources/images/wanshowbingo-bread.png");
        $("title").text("BREAD SHOW BINGO!");
    } else if (selectedTheme === "ltx23") {
        //body.removeClass("original-theme").addClass("ltx-theme");
        $(".title img").attr("src", "./resources/images/ltxexpobingo.png");
        $("title").text("LTX BINGO!");
    } else if (selectedTheme === "afterdark") {
        //body.removeClass("original-theme").addClass("aftedark-theme");
        $(".title img").attr("src", "./resources/images/wanshowbingo-afterdark.png");
        $("title").text("AFTER DARK BINGO!");
    } else if (selectedTheme === "darkmode") {
        //body.removeClass("original-theme").addClass("darkmode-theme");
        $(".title img").attr("src", "./resources/images/wanshowbingo-w.png");
        $("title").text("WAN SHOW BINGO!");
    } else if (selectedTheme === "lightmode") {
        //body.removeClass("original-theme").addClass("lightmode-theme");
        $(".title img").attr("src", "./resources/images/wanshowbingo-b.png");
        $("title").text("WAN SHOW BINGO!");
    }
  });

  $(".item").click(function() {
    $(this).toggleClass("clicked");
  
    // Update the clicked tile's state in localStorage
    const clickedTiles = $(".item.clicked").map(function() {
      return $(this).index();
    }).get();
    localStorage.setItem("clickedTiles", JSON.stringify(clickedTiles));

    //Just watching some data for a bit. I'm working on a way to detect actual players from trolls and need some sample data.
    const msg = $(this).children().html() + " : " + $(this).hasClass("clicked");
    socket.emit('dataSend', msg);

    //check for winner! There is probably an algo for this...
      const check = $("#board").children();

      function checkTiles(numbers) {
          let count = 0;
          // ... spreads the numbers from the array to be individual parameters
          numbers.forEach(function (currentNumber) {
              if ($(check[currentNumber]).hasClass("clicked")) {
                  count++;
              }
          });
          if (count === numbers.length) {
            debugger;
              return true;
          }
          return false;
      }

      //ROWS
      if (checkTiles([0, 1, 2, 3, 4])) {
          winner();
      } else if (checkTiles([5, 6, 7, 8, 9])) {
          winner();
      } else if (checkTiles([10, 11, 12, 13, 14])) {
          winner();
      } else if (checkTiles([15, 16, 17, 18, 19])) {
          winner();
      } else if (checkTiles([20, 21, 22, 23, 24])) {
          winner();
      }
      //COLUMNS!
      else if (checkTiles([0, 5, 10, 15, 20])) {
          winner();
      } else if (checkTiles([1, 6, 11, 16, 21])) {
          winner();
      } else if (checkTiles([2, 7, 12, 17, 22])) {
          winner();
      } else if (checkTiles([3, 8, 13, 18, 23])) {
          winner();
      } else if (checkTiles([4, 9, 14, 19, 24])) {
          winner();
      }
      //CRISS CROSS
      else if (checkTiles([0, 6, 12, 18, 24])) {
          winner();
      } else if (checkTiles([4, 8, 12, 16, 20])) {
          winner();
      } else {
          loser();
      }
  });

  function loser() {
    $("#winner").addClass("hidden");
  }

  function winner() {
    Swal.fire({
      icon: 'success',
      title: 'Congratulations!',
      text: 'You Win!',
      confirmButtonText: 'OK'
    });
  }

  // Random background image
  //const randomBackground = () => {
  //  const randomNumber = Math.floor(Math.random() * 3) + 1; // Generate random number between 1 and 3
  //  return `url("images/background${randomNumber}.jpeg")`; // pick background#,jpg based on random number above
  //};

  //$('#back-img').css('background-image', randomBackground());

  //Change the Color
  //$(".item").click(function() {
  //  $(this).toggleClass("clicked");

    // Continuously changing border color of clicked items is handled in style.css
  //});

});
