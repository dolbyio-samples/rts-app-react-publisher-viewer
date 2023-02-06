@publisher
Feature: Publisher streaming with camera only
    As a publisher
    I want to do live streaming for an event with camera only

    Background: Publisher camera preiew page
        Given a publisher is on the "preview" page

    @only
    Scenario: Verify the header information, settings options, camera view, stream stats when streaming with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "header" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

    @only
    Scenario: Verify the publisher is redirected to preview page when streaming is stopped
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And wait for "1" seconds

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "header" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

    @only
    Scenario: Stream duration is not zero when stream is live
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0][4-9]$ |

    @only
    Scenario: Publisher should be able to toggle camera and microphone when streaming
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page

        When the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
        And the "camera view video mute image" should be displayed

        When the publisher turns On the "video of camera view"
        And the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

    @only
    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming
        When the publisher turns Off the "video of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | video button status     | Off    |
        And the "camera view video mute image" should be displayed

        When the publisher turns On the "video of camera view"
        Then the "camera view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

        When the publisher turns Off the "video of camera view"
        And the "camera view" should be displayed with following values
            | video button status     | Off     |
        And the "camera view video mute image" should be displayed

    @only
    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming
        When the publisher turns Off the "audio of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | audio button status | Off  |
        And the "camera view video mute image" should not be displayed

        When the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

        When the publisher turns Off the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | audio button status | Off  |
        And the "camera view video mute image" should not be displayed

    Scenario: Publisher should be able to start streaming with microphone/camera Off and toggle microphone/camera during streaming
        Given a publisher is on the "preview" page
        And the publisher turns Off the "camera of camera view"
        And the publisher turns Off the "microphone of camera view"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values only
            | camera button status     | Off                |
            | microphone button status | Off                |

        When the publisher turns On the "camera of camera view"
        And the publisher turns On the "microphone of camera view"
        Then the "camera view" should be displayed with following values only
            | camera button status     | On                 |
            | microphone button status | On                 |

    Scenario: Publisher should be presented with Resolution and Bitrate Setting controls when streaming with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view settings title" text should be "Settings"
        And the number of "camera view settings dropdowns" count should be "2"
        And the "camera view resolution dropdown" should be displayed
        And the "camera view resolution dropdown" should be enabled
        And the "camera view bitrate dropdown" should be displayed
        And the "camera view bitrate dropdown" should be enabled
        And the "camera view source name input" should not be displayed
        And the "camera view codec dropdown" should not be displayed
        And the "camera view simulcast switch" should not be displayed

    Scenario: Publisher should be presented with different resolutions under setting when streaming with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options

    Scenario: Publisher should be presented with different bitrate under setting when streaming with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 Kbps,250 Kbps" options

    Scenario: Verify source name is reflected correctly after modifing it when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | source name |  BuiltIn Camera |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | source name text   | BuiltIn Camera     |
            | stream info button | displayed\|enabled |

    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" stream stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |
        |  vp9    |
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" stream stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |

    Scenario: Publisher should be able to stream with <resolution> resolution and simulcast ON when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast     | On            |
            | resolution    | <resolution>  |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
            
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - Auto            |
        And the "camera view" stream stats with quality tabs should be displayed with default values
    Examples:
        |  resolution  |
        |  640x480      |

    Scenario: Publisher should be able to stream with <bitrate> bitrate and simulcast ON when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast  | On         |
            | bitrate    | <bitrate>  |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stream stats with quality tabs should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  1 Mbps     |
        |  500 Kbps   |
        |  250 Kbps   |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <resolution> resolution, <codec> codec and simulcast ON when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | resolution   | <resolution> |
            | bitrate      | <bitrate>    |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stream stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        | codec |  resolution | bitrate    |
        | vp8   |  640x480    | 2 Mbps     |
        | h264  |  640x480    | 500 Kbps   |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <resolution> resolution, <codec> codec and simulcast OFF when streaming with camera
        Given a publisher is on the "preview" page
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | Off          |
            | codec        | <codec>      |
            | resolution   | <resolution> |
            | bitrate      | <bitrate>    |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stream stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        | codec |  resolution | bitrate    |
        | vp9   |  640x480    | 2 Mbps     |
        | vp8   |  640x480    | 500 Kbps   |
        | h264  |  640x480    | 250 Kbps   |

    @ignore #Issue-259
    Scenario: Publisher should be able to change the bitrate to <bitrate> when streaming is live with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate      | <bitrate>    |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stream stats with quality tabs should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 Kbps   |

    @ignore #Issue-259
    Scenario: Publisher should be able to change the resolution to <resolution> when streaming is live with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | resolution    | <resolution>    |
        And the "camera view" setting should be displayed with following values only
            | resolution    | Resolution  - <resolution>  |
            | bitrate       | Bitrate  - Auto             |
        And the "camera view" stream stats with quality tabs should be displayed with default values
    Examples:
        |  resolution  |
        |  640x480     |

    @ignore #Issue-258
    Scenario: Publisher should be able to change the bitrate multiple time when streaming is live with camera
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate     | 2 Mbps             |
        Then the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 2 Mbps   |
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate     | 500 Kbps           |
        Then the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "camera view" stream stats with quality tabs should be displayed with default values

    @ignore #Issue-259
    Scenario: Publisher settings should be preserved after the streaming is stopped when changed during streaming
        Given a publisher is on the "preview" page
        When the publisher configures "camera view" setting with the following values only
            | source name | Dummy Camera View |
            | codec       | vp8               |
            | bitrate     | 1 Mbps            |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | resolution  | 640x480  |
            | bitrate     | 2 Mbps    |
        And the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "camera view" setting should be displayed with following values only
            | resolution  | Resolution  - 640x480   |
            | bitrate     | Bitrate  - 2 Mbps       |
            | source name | Dummy Camera View       |
        And the "camera view" should be displayed with following values
            | source name text | Dummy Camera View |
