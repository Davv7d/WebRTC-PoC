//Ustawienia servera
const configuration = {
    //BUNDLE jest to jedna z funkcji protokołu SDP
    //służy do ustalania sposobu użycia BUNDLE
    //Przyjmuje 3 możliwe parametry(domyślnie: "balanced"):
        //max-bundle  -- instructs the browser to pick one media track to negotiate and will only send that one
        //max-combat  -- instructs the browser to separate each track into its own connection
        //balanced    -- instructs the browser to pick two tracks to send — one audio and one video
    bundlePolicy:"max-bundle",
//##############################################################################################################################################

    //stosowane w połączeniuw  celu uwierzytelniania
    //domyślnie sam sobie generuje dla każdej instancji RTCPeerConnection
    certificates: 'I dont know',
//##############################################################################################################################################

    //Niepodpisana 16 bitowa  wartosć całkowita określająca wstępną pulle kandydatów do ICE
    //Domyślna wartość 0 oznacza ,że nie wystąpi żadne wstępne pobieranie  z wyprzedzeniem 
    iceCandidatePoolSize: 0,
//##############################################################################################################################################

    //Tablica obiektów z których każdy opisuje jedn serwer np. STUN lub TURN 
        //każdy obiekt zawiera informacje jak połączyć się z konkretnym serwerem
            //urls           -- adress serwera, server może mieć ich kilka wtedy przekazujemy w tablicy ["adres1","adres2"]
            //username       -- jest używane do uwierzytelniania 
            //credential     -- poświadczenie przy logowaniu coś aka hasło 
            //credentialType -- definiuje metode uwierzytelniania,możliwe wartości:
                //password(domyślna)
                //oauth 
    iceServers:[
        {
            urls: "stun:stun.services.mozilla.com", //STUN
            username: "louis@mozilla.com", 
            credential: "webrtcdemo"
        },
        {
            urls: "turn:turnserver.example.org",  // A TURN server
            username: "webrtc",
            credential: "turnpassword"
        },
        {
            urls: [
                "stun:stun.example.com",        //STUN server  z 2 adresami 
                "stun:stun-1.example.com"
            ]
        }

    ],
//##############################################################################################################################################

    // polityka transportowa w ICE domyślnie "all"
    iceTransportPolicy: "all",
//##############################################################################################################################################

    //po ustawieniu tego połączy nas z innym użytkownikiem tylko wtedy gdy ten będzie również miał to skonfigurowane pod tą samą nazwa
    peerIdentity: "potato"      ,             //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Do sprawdzenia
//##############################################################################################################################################

    //polityka multipleksera RTCP, która ma być używana podczas gromadzenia kandydatów do ICE, require wartosc domyślna
     rtcpMuxPolicy: 'require'
};