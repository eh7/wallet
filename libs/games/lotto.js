module.exports = class Lotto {

  constructor() {
    console.log("Lotto Object Initalised");
  }

  main(req, res) {

    var errors = [];

    var services = [ 
                     {name:'New Lotto Game',url:'/wallet/games/lotto/new'},
                     {name:'Play Lotto',url:'/wallet/games/lotto/play'},
                     {name:'View Lotto Result',url:'/wallet/games/lotto/view'},
                     {name:'Games Menu',url:'/wallet/games'},
                   ];

    var data = {
                 "page_title":"Wallet Systems - Games Lotto",
                 "errors":errors,
                 "services":services,
               };

    res.render('pages/games', data);

    return "lotto.main()";
  }

  listLiveGames(req, res) {
//    res.render('pages/games', this.data);
    return "listLiveGames";
  }

  play() {
    return "play";
  }

  view() {
    return "view";
  }

};

