'use strict';

var getMoviesInBubbles = function(cb){
    var message = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Central Intelligence",
                    "image_url": "http://secondsuntil.com/wp-content/uploads/2016/03/central-intelligence-movie-poster.jpg",
                    "subtitle": "Vom Regisseur von „We’re the Millers“: Dwayne...",
                    "buttons": [{
                        "type": "postback",
                        "title": "Film wählen",
                        "payload": "selectedMovie=Central Intelligence"
                    }, {
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22639/central-intelligence/schedule",
                        "title": "Details"
                    }]
                }, {
                    "title": "The Nice Guys",
                    "image_url": "http://secondsuntil.com/wp-content/uploads/2016/03/the-nice-guys.jpg",
                    "subtitle": "Vom Macher von „Lethal Weapon“: Russell Crowe...",
                    "buttons": [{
                        "type": "postback",
                        "title": "Film wählen",
                        "payload": "selectedMovie=The Nice Guys"
                    }, {
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22385/the-nice-guys/schedule",
                        "title": "Details"
                    }]
                }, {
                    "title": "X-Men: Apocalypse 3D",
                    "image_url": "http://secondsuntil.com/wp-content/uploads/2016/03/maxresdefault-4.jpg",
                    "subtitle": "Jennifer Lawrence und ein junges Mutanten-Team...",
                    "buttons": [{
                        "type": "postback",
                        "title": "Film wählen",
                        "payload": "selectedMovie=X-Men: Apocalypse 3D"
                    }, {
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/21899/x-men-apocalypse/schedule",
                        "title": "Details"
                    }]
                }]
            }
        }
    };
    cb(message);
}

var getAvailableDates = function(cb){
    var message = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Wann möchtest du ins Kino gehen?",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Heute",
                        "payload":"Heute"
                    },
                    {
                        "type":"postback",
                        "title":"Morgen",
                        "payload":"Morgen"
                    },
                    {
                        "type":"postback",
                        "title":"Anderes Datum",
                        "payload":"otherDate"
                    }
                ]
            }
        }
    };
    cb(message);
}

var getAvailableTimes = function(cb){
    var message = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "14:30",
                    "subtitle": "DE, 3D, Cine Deluxe, Saal 3",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22639/central-intelligence/schedule",
                        "title": "Tickets"
                    }]
                }, {
                    "title": "16:30",
                    "subtitle": "DE, 3D, Saal 4",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22639/central-intelligence/schedule",
                        "title": "Tickets"
                    }]
                }, {
                    "title": "18:00",
                    "subtitle": "DE, Saal 4",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22639/central-intelligence/schedule",
                        "title": "Tickets"
                    }]
                }, {
                    "title": "20:15",
                    "subtitle": "DE, Saal 4",
                    "buttons": [{
                        "type": "web_url",
                        "url": "http://www.pathe.ch/de/film/22639/central-intelligence/schedule",
                        "title": "Tickets"
                    }]
                }]
            }
        }
    };
    cb(message);
}

var getTheatresInBasel = function(cb) {
    var message = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Wähle dein Kino",
                "buttons": [
                    {
                        "type": "postback",
                        "title": "Pathé Küchlin",
                        "payload": "Pathé Küchlin"
                    },
                    {
                        "type": "postback",
                        "title": "Pathé Plaza",
                        "payload": "Pathé Plaza"
                    },
                    {
                        "type": "postback",
                        "title": "Egal",
                        "payload": "otherDate"
                    }
                ]
            }
        }
    };
    cb(message);
}

var getTheatresInLausanne = function(cb){
    var message = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Wähle dein Kino",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Pathé Flon",
                        "payload":"Pathé Flon"
                    },
                    {
                        "type":"postback",
                        "title":"Pathé Galeries",
                        "payload":"Pathé Galeries"
                    },
                    {
                        "type":"postback",
                        "title":"Egal",
                        "payload":"otherDate"
                    }
                ]
            }
        }
    };
    cb(message);
}

var getTheatresInGenf = function(cb){
    var message = {
        "attachment":{
            "type":"template",
            "payload":{
                "template_type":"button",
                "text":"Wähle dein Kino",
                "buttons":[
                    {
                        "type":"postback",
                        "title":"Pathé Balexert",
                        "payload":"Pathé Balexert"
                    },
                    {
                        "type":"postback",
                        "title":"Pathé Rex",
                        "payload":"Pathé Rex"
                    },
                    {
                        "type":"postback",
                        "title":"Egal",
                        "payload":"otherDate"
                    }
                ]
            }
        }
    };
    cb(message);
}

module.exports = {
    getMoviesInBubbles: getMoviesInBubbles,
    getAvailableDates: getAvailableDates,
    getAvailableTimes: getAvailableTimes,
    getTheatresInBasel: getTheatresInBasel,
    getTheatresInLausanne: getTheatresInLausanne,
    getTheatresInGenf: getTheatresInGenf,
};