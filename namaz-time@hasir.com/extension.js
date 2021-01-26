const St = imports.gi.St;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const PanelMenu = imports.ui.panelMenu;

const TW_URL = 'http://www.islamicfinder.us/index.php/api/prayer_times';


let _httpSession;
const TransferWiseIndicator = new Lang.Class({
  Name: 'TransferWiseIndicator',
  Extends: PanelMenu.Button,

  _init: function () {
    this.parent(0.0, "Transfer Wise Indicator", false);
    this.buttonText = new St.Label({
      text: _("Loading..."),
      y_align: Clutter.ActorAlign.CENTER
    });
    this.actor.add_actor(this.buttonText);
    this._refresh();
  },

  _refresh: function () {
    this._loadData(this._refreshUI);
    this._removeTimeout();
    this._timeout = Mainloop.timeout_add_seconds(2000, Lang.bind(this, this._refresh));
    return true;
  },

  _loadData: function () {
    let today = new Date();
    let date = today.getDate()
    let month = today.getMonth() + 1
    let year = today.getFullYear()
    let dateToday = date + "-" + month + "-" + year
    let params = {
        "date": dateToday.toString(),
        // Change to location to display results for your city.
        "latitude": "34.04513309358292",
        "longitude": "74.81649712439841",
        "method": "1",
        "timezone": "Asia/Kolkata",
    };
    _httpSession = new Soup.Session();
    let message = Soup.form_request_new_from_hash('GET', TW_URL, params);
    _httpSession.queue_message(message, Lang.bind(this, function (_httpSession, message) {
          if (message.status_code !== 200)
            return;
          let json = JSON.parse(message.response_body.data);
          this._refreshUI(json);
        }
      )
    );
  },

  _refreshUI: function (data) {
    let currentTime = new Date();
    let timeNow = currentTime.toTimeString();
    let txt = data;
    let setText;
    // Gives HH:MM in 24hr
    global.log(timeNow.substring(0,5));
    let hourNow = parseInt(timeNow.substring(0,2))
    let fajrHour = parseInt(txt.results['Fajr'].substring(0,1))  
    let dhuhrHour = parseInt(txt.results['Dhuhr'].substring(0,2))
    let asrHour = parseInt(txt.results['Asr'].substring(0,1)) + 12
    let maghribHour = parseInt(txt.results['Maghrib'].substring(0,1)) + 12
    
    if( hourNow < fajrHour) {
      setText = "Fajr: " + txt.results['Fajr'].replace(/%/g, '').toUpperCase() + "  " + "Zawal: " + txt.results['Duha'].replace(/%/g, '').toUpperCase()
      this.buttonText.set_text(setText);
    }
    if( hourNow < dhuhrHour && hourNow > fajrHour) {
      setText = "Dhuhr: " + txt.results['Dhuhr'].replace(/%/g, '').toUpperCase()
      this.buttonText.set_text(setText);
    }
    if( hourNow < asrHour && hourNow > dhuhrHour) {
      setText = "Asr: " + txt.results['Asr'].replace(/%/g, '').toUpperCase()
      this.buttonText.set_text(setText);
    }
    if( hourNow < maghribHour && hourNow > asrHour) {
      setText = "Maghrib: " + txt.results['Maghrib'].replace(/%/g, '').toUpperCase()
      this.buttonText.set_text(setText);
    }
    if( hourNow <= 23 && hourNow > maghribHour) {
      setText = "Isha: " + txt.results['Isha'].replace(/%/g, '').toUpperCase()
      this.buttonText.set_text(setText);
    }
    // let txt = data.toString();
    // txt = txt.substring(0,6) + ' CHF';
    //global.log("---------------------")
  },

  _removeTimeout: function () {
    if (this._timeout) {
      Mainloop.source_remove(this._timeout);
      this._timeout = null;
    }
  },

  stop: function () {
    if (_httpSession !== undefined)
      _httpSession.abort();
    _httpSession = undefined;

    if (this._timeout)
      Mainloop.source_remove(this._timeout);
    this._timeout = undefined;

    this.menu.removeAll();
  }
});

let twMenu;

function init() {
}

function enable() {
	twMenu = new TransferWiseIndicator;
	Main.panel.addToStatusArea('tw-indicator', twMenu);
}

function disable() {
	twMenu.stop();
	twMenu.destroy();
}