var settings=exports.settings={SCREEN_WIDTH:,  //screen width in pixels
                                SCREEN_HEIGHT:600, //screen height in pixels
                                FPS:9999,        //logic updates per second
                                PHYS_SCALE:10,    //pixels in a meter
                                STARTING_BALANCE:3000, //default 3000
                                STARTING_LEAGUE:0,
                                SERVER:'ws://localhost:8001',
                                DEBUG:true,
                                SOUND:true,
                                ENGINE_SOUND:false};     //game server

exports.get=function(name){
    return settings[name];
};

exports.init=function(){
    for(var key in settings){
        if(window.hasOwnProperty(key)){
            settings[key]=window[key];
        }
    }
};

exports.set=function(name, value){
    settings[name]=value;
};
