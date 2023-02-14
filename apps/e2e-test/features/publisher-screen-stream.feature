@e2e
@ignore
Feature: Publisher streaming with Screen share
    As a publisher
    I want to do live streaming for an event with screen share

    Background: Add screen source on preview page
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app
        When the publisher adds "screen" source
        Then the "screen view" should be displayed with default values

    @only
    Scenario: Verify the header information, settings options, camera view, stream stats when streaming with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with following values
            | multi source label       |  displayed           |
            | multi source label text  |  Multisource enabled |

        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with default values
        And the "screen view" stats with quality tabs should be displayed with default values

        And the "camera view" should be displayed with following values
            | close button | displayed\|enabled |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "header" should be displayed with default values

        When the viewer clicks on the "screen share tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"
        And the "screen share tile list item" should be displayed    
        And the "camera tile list item" should be displayed 

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

    @only
    Scenario: Verify the publisher is redirected to preview page when streaming is stopped
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page

        # Publisher App      
        And switch to "publisher-streaming" page on "publisher" app  
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "screen view" should be displayed with default values
        And the "camera view" should be displayed with following values
            | close button | displayed\|enabled |
        And the "screen view" setting should be displayed with default values
        And the "camera view" setting should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "header" should be displayed with default values
        And the "main view" should not be displayed

    @only
    Scenario: Stream duration is not zero when stream is live with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0][4-9]$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0][4-9]$ |   

    @only
    Scenario: Publisher should be able to toggle camera and microphone when streaming with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher turns Off the "video of screen view"
        And the publisher turns Off the "audio of screen view"
        Then the "screen view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
        And the "screen view video mute image" should be displayed

        When the publisher turns On the "video of screen view"
        And the publisher turns On the "audio of screen view"
        Then the "screen view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

    @only
    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming with screen share
        When the publisher turns Off the "video of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | video button status     | Off      |
        And the "screen view video mute image" should be displayed

        When the publisher turns On the "video of screen view"
        Then the "screen view" should be displayed with default values
        And the "screen view video mute image" should not be displayed

        When the publisher turns Off the "video of screen view"
        Then the "screen view" should be displayed with following values only
            | video button status | Off      |
            | audio button status | On       |
        And the "screen view video mute image" should be displayed

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming with screen share
        When the publisher turns Off the "audio of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | audio button status | Off       |
        And the "screen view video mute image" should not be displayed

        When the publisher turns On the "audio of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | On                 |
            | microphone button status | On                 |

        When the publisher turns Off the "microphone of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | On                 |
            | microphone button status | Off                |

    Scenario: Publisher should be able to start streaming with microphone/camera Off and toggle microphone/camera during streaming with screen share
        When the publisher turns Off the "camera of screen view"
        And the publisher turns Off the "microphone of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" should be displayed with following values only
            | camera button status     | Off                |
            | microphone button status | Off                |

        When the publisher turns On the "camera of screen view"
        And the publisher turns On the "microphone of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | On                 |
            | microphone button status | On                 |

    Scenario: Publisher should be presented with Bitrate Setting controls when streaming with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        When the publisher clicks on the "screen view setting button"
        Then the "screen view settings" should be displayed
        And the "screen view settings title" text should be "Settings"
        And the number of "screen view settings dropdowns" count should be "1"
        And the "screen view bitrate dropdown" should be displayed
        And the "screen view bitrate dropdown" should be enabled
        And the "screen view resolution dropdown" should not be displayed
        And the "screen view source name input" should not be displayed
        And the "screen view codec dropdown" should not be displayed
        And the "screen view simulcast switch" should not be displayed

    Scenario: Publisher should be presented with different bitrate under setting when streaming with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        When the publisher clicks on the "screen view setting button"
        Then the "screen view settings" should be displayed
        And the "screen view bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 Kbps,250 Kbps" options

    Scenario: Verify source name is reflected correctly after modifing it when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | source name |  Dummy Screen View |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" should be displayed with following values
            | source name text | Dummy Screen View |
            | stream info button | displayed\|enabled |
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |

    @ignore #Issue-262
    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        And the "screen view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "screen view" stream stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" stream stats with high quality tab should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |
        |  vp9    |
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        And the "screen view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "screen view" stream stats with high quality tab should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "camera view" stream stats with high quality tab should be displayed with following values
            | Codecs:  | regex: ^video/H264, audio/opus$ |
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |

    Scenario: Publisher should be able to stream with <bitrate> bitrate and simulcast ON when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast  | On         |
            | bitrate    | <bitrate>  |
        And the publisher configures "camera view" setting with the following values only
            | simulcast  | On         |
            | bitrate    | 1 Mbps     |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stream stats with high quality tab should be displayed with default values
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 1 Mbps          |
        And the "camera view" stream stats with high quality tab should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  1 Mbps     |
        |  500 Kbps   |
        |  250 Kbps   |

    @ignore #Issue-262
    Scenario: Publisher should be able to stream with <bitrate> bitrate and simulcast OFF when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast  | Off        |
            | bitrate    | <bitrate>  |
        And the publisher configures "camera view" setting with the following values only
            | simulcast  | On         |
            | bitrate    | 1 Mbps     |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stream stats should be displayed with default values
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 1 Mbps          |
        And the "camera view" stream stats with high quality tab should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 Kbps   |

    @ignore #Issue-277
    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast ON when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | bitrate      | <bitrate>    |
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | vp8          |
            | bitrate      | 500 Kbps     |
            | resolution   | 640x480      |

        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stream stats with high quality tab should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - 640x480 |
            | bitrate    | Bitrate  - 500 Kbps   |
        And the "camera view" stream stats with high quality tab should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |
    Examples:
        | codec | bitrate    |
        | vp8   | 2 Mbps     |
        | h264  | 500 Kbps   |

    @ignore #Issue-277
    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast OFF when streaming with screen share
        When the publisher configures "screen view" setting with the following values only
            | simulcast    | Off          |
            | codec        | <codec>      |
            | bitrate      | <bitrate>    |
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | vp8          |
            | bitrate      | 250 Kbps     |
            | resolution   | 640x480      |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stream stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stream stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
    Examples:
        | codec | bitrate    |
        | vp9   | 2 Mbps     |
        | vp8   | 500 Kbps   |
        | h264  | 250 Kbps   |

    @ignore #Issue-259
    Scenario: Publisher should be able to change the bitrate to <bitrate> when streaming is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        
        When the publisher configures "screen view" setting with the following values only
            | bitrate      | <bitrate>    |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stream stats with quality tabs should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 Kbps   |

    @ignore #Issue-258
    Scenario: Publisher should be able to change the bitrate multiple time when streaming is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        When the publisher configures "screen view" setting with the following values only
            | bitrate     | 2 Mbps             |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 2 Mbps   |
        
        When the publisher configures "screen view" setting with the following values only
            | bitrate     | 500 Kbps           |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 Kbps |
        And the "screen view" stream stats with quality tabs should be displayed with default values

    @ignore #Issue-258
    Scenario: Publisher settings should be preserved after the streaming is stopped when changed during streaming
        When the publisher configures "screen view" setting with the following values only
            | source name | Dummy Screen View |
            | codec       | vp8               |
            | bitrate     | 2 Mbps            |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page     
        
        When the publisher configures "screen view" setting with the following values only
            | bitrate     | 1 Mbps             |
        And the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "screen view" setting should be displayed with following values only
            | source name | Dummy Screen View     |
            | codec       | Codec  - vp8          |
            | bitrate     | Bitrate  - 1 Mbps     |
        And the "screen view" should be displayed with following values
            | source name text | Dummy Screen View |

    
    #TODO: Go Live from View 