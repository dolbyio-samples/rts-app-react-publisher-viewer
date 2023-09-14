@publisher-viewer
@screen-share-streaming
Feature: Publisher Screen Streaming
    As a publisher
    I want to do live streaming for an event with screen share

    Background: Add screen source on preview page
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app
        When the publisher adds "screen" source
        Then the "screen view" should be displayed with default values
        And the "camera view" should be displayed

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

        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

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
        And the "camera view" should be displayed with default values
        And the "screen view" setting should be displayed with default values
        And the "camera view" setting should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        # And the "header" should be displayed with default values
        And the "main view" should not be displayed

    Scenario: Stream duration is not zero when stream is live with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0-1][0-9]$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0-2][0-9]$ |

    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming with screen share
        When the publisher turns Off the "video of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | video button status     | Off      |
        And the "screen view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of screen view"
        And the publisher turns Off the "video of camera view"
        Then the "screen view" should be displayed with default values
        And the "screen view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | video button status | Off |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer clicks on the "screen share tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "video of screen view"
        Then the "screen view" should be displayed with following values only
            | video button status | Off      |
        And the "screen view video mute image" should be displayed
        And the "camera view" should be displayed with following values
            | video button status | Off      |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "screen share tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming with screen share
        # Publisher App
        When the publisher turns Off the "audio of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | audio button status | Off       |
        And the "screen view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "audio of screen view"
        When the publisher turns Off the "audio of camera view"
        Then the "screen view" should be displayed with default values
        And the "screen view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | audio button status | Off |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "screen share tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "audio of screen view"
        Then the "screen view" should be displayed with following values only
            | audio button status | Off    |
        And the "camera view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | audio button status | Off    |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "screen share tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone-camera Off and toggle microphone-camera during streaming with screen share
        # Publisher App
        When the publisher turns Off the "video of screen view"
        And the publisher turns Off the "audio of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
        And the "screen view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of screen view"
        And the publisher turns On the "audio of screen view"
        When the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        Then the "screen view" should be displayed with default values
        And the "screen view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | video button status | Off |
            | audio button status | Off |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "screen share tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be presented with Bitrate Setting controls when streaming with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher clicks on the "screen view setting button"
        Then the "settings popup" should be displayed
        And the "settings title" text should be "Stream settings"
        And the number of "settings dropdowns" count should be "1"
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 kbps,250 kbps" options

        And the "source name input" should not be displayed
        And the "resolution dropdown" should not be displayed
        And the "codec dropdown" should not be displayed
        And the "simulcast switch" should not be displayed

    Scenario: Viewer should be presented with quality Setting controls when streaming with screen share
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled

    Scenario: Verify source name is reflected correctly after modifing it when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | source name |  Dummy Screen View |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | source name text | Dummy Screen View |
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        When the viewer projects main stream as source name containing "Dummy Screen View"
        Then the "main view" should be displayed with following values
            | source name text   | Dummy Screen View     |

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text   | contains: fake     |    

    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "screen view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/h264, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed  

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |
        |  vp9    |
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "screen view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/h264, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed


        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled

    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast ON when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | bitrate      | <bitrate>    |
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | vp8          |
            | bitrate      | 500 kbps     |
            | resolution   | 1280x720     |

        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - 1280x720 |
            | bitrate    | Bitrate  - 500 kbps    |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |
        And the "main view" setting should be displayed with default values

    Examples:
        | codec | bitrate    |
        | vp8   | 2 Mbps     |
        | h264  | 500 kbps   |

    Scenario: Publisher should be able to stream with combination of lower bitrate <bitrate> , <codec> codec and simulcast ON when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | bitrate      | <bitrate>    |
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | vp8          |
            | bitrate      | 500 kbps     |
            | resolution   | 1280x720     |

        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - 1280x720 |
            | bitrate    | Bitrate  - 500 kbps    |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |
        And the "main view" setting should be displayed with default values

    Examples:
        | codec | bitrate    |
        | vp8   | 250 kbps   |
        | h264  | 250 kbps   |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast OFF when streaming with screen share
        # Publisher App
        When the publisher configures "screen view" setting with the following values only
            | simulcast    | Off          |
            | codec        | <codec>      |
            | bitrate      | <bitrate>    |
        And the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | vp8          |
            | bitrate      | 250 kbps     |
            | resolution   | 1280x720     |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - 1280x720 |
            | bitrate    | Bitrate  - 250 kbps    |
        And the "camera view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |
        And the "main view" setting should be displayed with default values
    Examples:
        | codec | bitrate    |
        | vp9   | 2 Mbps     |
        | vp8   | 500 kbps   |
        | h264  | 1 Mbps     |

    Scenario: Publisher should be able to change the bitrate to <bitrate> when streaming is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "screen view" setting with the following values only
            | bitrate      | <bitrate>    |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "screen view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 kbps   |

    Scenario: Publisher should be able to change the bitrate multiple time when streaming is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher configures "screen view" setting with the following values only
            | bitrate     | 2 Mbps             |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 2 Mbps   |
        
        When the publisher configures "screen view" setting with the following values only
            | bitrate     | 500 kbps           |
        Then the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "screen view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values

    Scenario: Publisher settings should be preserved after the streaming is stopped when changed during streaming
        When the publisher configures "screen view" setting with the following values only
            | source name | Dummy Screen View |
            | codec       | vp8               |
            | bitrate     | 2 Mbps            |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page     
        
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

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        # And the "header" should be displayed with default values
        And the "main view" should not be displayed

    @ignore #bug - 326
    Scenario: Viewer should be able to select video quality <quality> when streaming is live with screen share
        When the publisher clicks on the "camera view close button"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        
        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view" should be displayed with following values
            | close button | hidden |
        And the "screen view" setting should be displayed with default values
        And the "screen view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |
        |  Auto     |

    Scenario: Viewer should be able to toggle video on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns Off the "video of main view"
        Then the "main view" should be displayed with following values
            | video button status | Off |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "video of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle playback on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |


        When the viewer turns Off the "playback of main view"
        Then the "main view" should be displayed with following values
            | playback button status | Off |
            | source name text       | contains: screen |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "playback of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle audio on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns On the "audio of main view"
        Then the "main view" should be displayed with following values
            | audio button status | On |
            | source name text    | contains: screen |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns Off the "audio of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view video mute image" should not be displayed

    Scenario: Viewer should be able to make the video view into full screen
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        When the viewer clicks on the "main view full screen button"
        # And the "header" should be displayed with default values
        And the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed                

    @ignore #bug - 326
    Scenario: Viewer should be able to select video quality <quality> in full screen mode when streaming is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        
        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: screen |

        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with default values
        And the "screen view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |

    Scenario: Pubisher should be able to start and stop the streaming using individual source start-stop button
        # Publisher App
        When the publisher clicks on the "screen view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with default values
        And the "screen view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view stop button"
        Then the publisher should be navigated to "preview" page
        And the "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

        # Publisher App
        And switch to "preview" page on "publisher" app
        When the publisher clicks on the "screen view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        When the publisher clicks on the "camera view go live button"
        Then the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed 

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Pubisher should be able to start using start all go live option and stop the streaming using individual source stop button
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view stop button"
        And the "screen view" should be displayed with following values
            | go live button     | displayed\|enabled |
            | go live button text | GO LIVE           |
            | stop button        | hidden             |
            | stop button text   | ignore:            |
            | stream info button | hidden             |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view stop button"
        Then the publisher should be navigated to "preview" page
        And the "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values
        

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

    Scenario: Pubisher should be able to start using individual source start button and stop the streaming using stop all button
        # Publisher App
        When the publisher clicks on the "screen view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text  | contains: screen |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view go live button"
        Then the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

    @ignore #Bug - 316
    Scenario: New source should be streamed automatically if publisher had stop any specific source during streaming
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view stop button"
        And the "screen view" should be displayed with following values only
            | go live button     | displayed\|enabled |
            | stop button        | hidden             |
        
        When the publisher adds "screen" source
        Then the "2nd" "screen view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        And the "main view" should be displayed with following values
            | source name text | contains: screen |
        And the "camera tile list item" should be displayed


        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "1st" "screen view play button"
        And the "1st" "screen view" should be displayed with default values
        And the "2nd" "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values
        

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

    Scenario: Stop the stream which is projected as main stream on viewer app
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        And the "main view" should be displayed with following values
            | source name text | contains: screen |
        And the "camera tile list item" should be displayed        

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view stop button"
        And the "screen view" should be displayed with following values only
            | go live button     | displayed\|enabled |
            | stop button        | hidden             |
        
        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text | contains: fake |

    Scenario: Close the stream which is projected as main stream on viewer app
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "screen"
        And the "main view" should be displayed with following values
            | source name text | contains: screen |
        And the "camera tile list item" should be displayed        

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view close button"
        And the "screen view" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text | contains: fake |

    Scenario: Publisher should be able to stream multiple 3 screen share and camera
        When the publisher configures "1st" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 1 |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |        
        And the publisher adds "screen" source
        And the publisher configures "2nd" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 2 |
            | simulcast    | Off                  |
            | codec        | vp9                  |
            | bitrate      | 1 Mbps               |
        And the publisher adds "screen" source
        And the publisher configures "3rd" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 3 |
            | simulcast    | On                   |
            | codec        | h264                 |


        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" setting should be displayed with default values
        And the "1st" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 1 |
        And the "1st" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 2 Mbps    |

        And the "2nd" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 2 |    
        And the "2nd" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 1 Mbps    |
        
        And the "3rd" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 3 |    
        And the "3rd" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - Auto      |
    
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "3"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "Dummy Screen Share 1"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 1 |
        And the "camera tile list item" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share 2" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share 3" should be displayed


        When the viewer projects main stream as source name containing "Dummy Screen Share 2"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 2 |
        When the viewer projects main stream as source name containing "Dummy Screen Share 3"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 3 |        

    Scenario: Publisher sould be able to stream screen share only without camera
        # Publisher App
        When the publisher clicks on the "camera view close button"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "screen view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text | contains: screen |
        And the "stream list items" should not be displayed

    Scenario: Publisher should be able to stream all sources as screen share
        When the publisher clicks on the "camera view close button"
        And the publisher configures "1st" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 1 |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |        
        And the publisher adds "screen" source
        And the publisher configures "2nd" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 2 |
            | simulcast    | Off                  |
            | codec        | vp9                  |
            | bitrate      | 1 Mbps               |
        And the publisher adds "screen" source
        And the publisher configures "3rd" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 3 |
            | simulcast    | On                   |
            | codec        | h264                 |
        And the publisher adds "screen" source
        And the publisher configures "4th" "screen view" setting with the following values only
            | source name  | Dummy Screen Share 4 |
            | simulcast    | Off                  |
            | codec        | vp8                  |
            | bitrate      | 500 kbps             |

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "1st" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 1 |
        And the "1st" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 2 Mbps    |

        And the "2nd" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 2 |    
        And the "2nd" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 1 Mbps    |
        
        And the "3rd" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 3 |    
        And the "3rd" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - Auto      |

        And the "4th" "screen view" should be displayed with following values only
            | source name text  | Dummy Screen Share 4 |    
        And the "4th" "screen view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 500 kbps      |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "3"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "Dummy Screen Share 1"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 1 |
        And the "stream list item" with locator attribute "Dummy Screen Share 2" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share 3" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share 4" should be displayed


        When the viewer projects main stream as source name containing "Dummy Screen Share 2"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 2 |
        When the viewer projects main stream as source name containing "Dummy Screen Share 3"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 3 |        
        When the viewer projects main stream as source name containing "Dummy Screen Share 4"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Screen Share 4 |    

    @ignore #Bug - 311
    Scenario: Video toggle should be preserved after swaping the streams on Viewer
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns Off the "video of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text    | contains: screen |
            | video button status | Off              |

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    @ignore #Bug - 311
    Scenario: Audio toggle should be preserved after swaping the streams on Viewer
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns Off the "audio of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text    | contains: screen |
            | audio button status | Off              |

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    @ignore #Bug - 311
    Scenario: Playback toggle should be preserved after swaping the streams on Viewer
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns Off the "playback of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text       | contains: screen |
            | playback button status | Off              |

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    @ignore #Bug - 311
    Scenario: Toggle controls should be preserved after swaping the streams on Viewer
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        
        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |

        When the viewer turns Off the "video of main view"
        And the viewer turns Off the "audio of main view"
        And the viewer turns Off the "playback of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text       | contains: screen |
            | vido button status     | Off              |
            | audio button status    | Off              |
            | playback button status | Off              |

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        When the viewer projects main stream as source name containing "screen"
        And the viewer turns On the "playback of main view"

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text       | contains: screen |
            | vido button status     | Off              |
            | audio button status    | Off              |
