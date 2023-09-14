@publisher-viewer
@local-file-streaming
Feature: Publisher Local File Streaming
    As a publisher
    I want to do live streaming for an event with local file

    Background: Add local file source on preview page
        Given a publisher is on the "preview" page
        And the "camera view" should be displayed
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app
        When the publisher adds "local" file source
        Then the "local file view" should be displayed with default values

    Scenario: Verify the header information, settings options, camera view, stream stats when streaming with local file
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with following values
            | multi source label       |  displayed           |
            | multi source label text  |  Multisource enabled |

        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with default values
        And the "local file view" stats with quality tabs should be displayed with default values

        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "screen view" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file.mp4 |
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
        And the "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "local file view" setting should be displayed with default values
        And the "camera view" setting should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        # And the "header" should be displayed with default values
        And the "main view" should not be displayed

    Scenario: Stream duration is not zero when stream is live with local file
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

    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming with local file
        When the publisher turns Off the "video of local file view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with following values
            | video button status     | Off      |
        And the "local file view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of local file view"
        Then the "local file view" should be displayed with default values
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer clicks on the "local file tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "video of local file view"
        Then the "local file view" should be displayed with following values only
            | video button status | Off      |
        And the "local file view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "local file tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming with local file
        # Publisher App
        When the publisher turns Off the "audio of local file view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with following values
            | audio button status | Off       |
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "audio of local file view"
        Then the "local file view" should be displayed with default values
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "local file tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "audio of local file view"
        Then the "local file view" should be displayed with following values only
            | audio button status | Off    |
        And the "camera view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "local file tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone-camera Off and toggle microphone-camera during streaming with local file
        # Publisher App
        When the publisher turns Off the "video of local file view"
        And the publisher turns Off the "audio of local file view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
        And the "local file view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of local file view"
        And the publisher turns On the "audio of local file view"
        Then the "local file view" should be displayed with default values
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        When the viewer clicks on the "local file tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer clicks on the "camera tile list item"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be presented with Bitrate Setting controls when streaming with local file
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher clicks on the "local file view setting button"
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

    Scenario: Viewer should be presented with quality Setting controls when streaming with local file
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled

    Scenario: Verify source name is reflected correctly after modifing it when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
            | source name |  Dummy Local File View |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with following values
            | source name text | Dummy Local File View |
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        When the viewer projects main stream as source name containing "Dummy Local File View"
        Then the "main view" should be displayed with following values
            | source name text   | Dummy Local File View     |

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text   | contains: fake     |    

    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "local file view" stats should be displayed with following values
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

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
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
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "local file view" stats with quality tabs should be displayed with following values
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

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
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

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast ON when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
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
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "local file view" stats with quality tabs should be displayed with following values
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
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
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

    Scenario: Publisher should be able to stream with combination of lower bitrate <bitrate> , <codec> codec and simulcast ON when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
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
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "local file view" stats with quality tabs should be displayed with following values
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
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
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

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <codec> codec and simulcast OFF when streaming with local file
        # Publisher App
        When the publisher configures "local file view" setting with the following values only
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
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "local file view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        And the "camera view" should be displayed with default values
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

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
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

    Scenario: Publisher should be able to change the bitrate to <bitrate> when streaming is live with local file
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "local file view" setting with the following values only
            | bitrate      | <bitrate>    |
        Then the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "local file view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 kbps   |

    Scenario: Publisher should be able to change the bitrate multiple time when streaming is live with local file
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher configures "local file view" setting with the following values only
            | bitrate     | 2 Mbps             |
        Then the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 2 Mbps   |
        
        When the publisher configures "local file view" setting with the following values only
            | bitrate     | 500 kbps           |
        Then the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "local file view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "local file view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values

    Scenario: Publisher settings should be preserved after the streaming is stopped when changed during streaming
        When the publisher configures "local file view" setting with the following values only
            | source name | Dummy Local File View |
            | codec       | vp8               |
            | bitrate     | 2 Mbps            |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page     
        
        When the publisher configures "local file view" setting with the following values only
            | bitrate     | 1 Mbps             |
        And the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "local file view" setting should be displayed with following values only
            | source name | Dummy Local File View     |
            | codec       | Codec  - vp8          |
            | bitrate     | Bitrate  - 1 Mbps     |
        And the "local file view" should be displayed with following values
            | source name text | Dummy Local File View |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        # And the "header" should be displayed with default values
        And the "main view" should not be displayed

    @ignore #bug - 326
    Scenario: Viewer should be able to select video quality <quality> when streaming is live with local file
        When the publisher clicks on the "camera view close button"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        
        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view" should be displayed with following values
            | close button | hidden |
        And the "local file view" setting should be displayed with default values
        And the "local file view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |
        |  Auto     |

    Scenario: Viewer should be able to toggle video on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns Off the "video of main view"
        Then the "main view" should be displayed with following values
            | video button status | Off |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "video of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle playback on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |


        When the viewer turns Off the "playback of main view"
        Then the "main view" should be displayed with following values
            | playback button status | Off |
            | source name text       | contains: local-file |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "playback of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle audio on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns On the "audio of main view"
        Then the "main view" should be displayed with following values
            | audio button status | On |
            | source name text    | contains: local-file |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns Off the "audio of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view video mute image" should not be displayed

    Scenario: Viewer should be able to make the video view into full local file
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        When the viewer clicks on the "main view full screen button"
        # And the "header" should be displayed with default values
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed                

    @ignore #bug - 326
    Scenario: Viewer should be able to select video quality <quality> in full local file mode when streaming is live with local file
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        
        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: local-file |

        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        And the "main view" should be displayed with following values
            | size              | Full             |
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with default values
        And the "local file view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |

    Scenario: Pubisher should be able to start and stop the streaming using individual source start-stop button
        # Publisher App
        When the publisher clicks on the "local file view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with default values
        And the "local file view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view stop button"
        Then the publisher should be navigated to "preview" page
        And the "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

        # Publisher App
        And switch to "preview" page on "publisher" app
        When the publisher clicks on the "local file view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with default values

        When the publisher clicks on the "camera view go live button"
        Then the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed 

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Pubisher should be able to start using start all go live option and stop the streaming using individual source stop button
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view stop button"
        And the "local file view" should be displayed with following values
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
        And the "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values
        

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

    Scenario: Pubisher should be able to start using individual source start button and stop the streaming using stop all button
        # Publisher App
        When the publisher clicks on the "local file view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view go live button"
        Then the "camera view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer clicks on the "camera tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "local file view" should be displayed with default values
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
        And the "local file view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view stop button"
        And the "local file view" should be displayed with following values only
            | go live button     | displayed\|enabled |
            | stop button        | hidden             |
        
        When the publisher adds "local" file source
        Then the "2nd" "local file view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "local-file"
        And the "main view" should be displayed with following values
            | source name text | contains: local-file |
        And the "camera tile list item" should be displayed


        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "1st" "local file view play button"
        And the "1st" "local file view" should be displayed with default values
        And the "2nd" "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values
        

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

    Scenario: Stop the stream which is projected as main stream on viewer app
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        And the "main view" should be displayed with following values
            | source name text | contains: local-file |
        And the "camera tile list item" should be displayed        

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view stop button"
        And the "local file view" should be displayed with following values only
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
        And the "local file view" should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        When the viewer projects main stream as source name containing "local-file"
        And the "main view" should be displayed with following values
            | source name text | contains: local-file |
        And the "camera tile list item" should be displayed        

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view close button"
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list items" should not be displayed
        And the "main view" should be displayed with following values
            | source name text | contains: fake |

    Scenario: Publisher should be able to stream multiple 3 local file and camera
        When the publisher configures "1st" "local file view" setting with the following values only
            | source name  | Dummy Local File 1 |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |        
        And the publisher adds "local" file source
        And the publisher configures "2nd" "local file view" setting with the following values only
            | source name  | Dummy Local File 2 |
            | simulcast    | Off                  |
            | codec        | vp9                  |
            | bitrate      | 1 Mbps               |
        And the publisher adds "local" file source
        And the publisher configures "3rd" "local file view" setting with the following values only
            | source name  | Dummy Local File 3 |
            | simulcast    | On                   |
            | codec        | h264                 |


        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" setting should be displayed with default values
        And the "1st" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 1 |
        And the "1st" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 2 Mbps    |

        And the "2nd" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 2 |    
        And the "2nd" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 1 Mbps    |
        
        And the "3rd" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 3 |    
        And the "3rd" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - Auto      |
    
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "3"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "Dummy Local File 1"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 1 |
        And the "camera tile list item" should be displayed
        And the "stream list item" with locator attribute "Dummy Local File 2" should be displayed
        And the "stream list item" with locator attribute "Dummy Local File 3" should be displayed


        When the viewer projects main stream as source name containing "Dummy Local File 2"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 2 |
        When the viewer projects main stream as source name containing "Dummy Local File 3"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 3 |        

    Scenario: Publisher sould be able to stream local file only without camera
        # Publisher App
        When the publisher clicks on the "camera view close button"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "local file view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text | contains: local-file |
        And the "stream list items" should not be displayed

    Scenario: Publisher should be able to stream all sources as local file
        When the publisher clicks on the "camera view close button"
        And the publisher configures "1st" "local file view" setting with the following values only
            | source name  | Dummy Local File 1 |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |        
        And the publisher adds "local" file source
        And the publisher configures "2nd" "local file view" setting with the following values only
            | source name  | Dummy Local File 2 |
            | simulcast    | Off                  |
            | codec        | vp9                  |
            | bitrate      | 1 Mbps               |
        And the publisher adds "local" file source
        And the publisher configures "3rd" "local file view" setting with the following values only
            | source name  | Dummy Local File 3 |
            | simulcast    | On                   |
            | codec        | h264                 |
        And the publisher adds "local" file source
        And the publisher configures "4th" "local file view" setting with the following values only
            | source name  | Dummy Local File 4 |
            | simulcast    | Off                  |
            | codec        | vp8                  |
            | bitrate      | 500 kbps             |

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "1st" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 1 |
        And the "1st" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 2 Mbps    |

        And the "2nd" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 2 |    
        And the "2nd" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 1 Mbps    |
        
        And the "3rd" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 3 |    
        And the "3rd" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - Auto      |

        And the "4th" "local file view" should be displayed with following values only
            | source name text  | Dummy Local File 4 |    
        And the "4th" "local file view" setting should be displayed with following values only
            | bitrate      | Bitrate  - 500 kbps      |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "3"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "Dummy Local File 1"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 1 |
        And the "stream list item" with locator attribute "Dummy Local File 2" should be displayed
        And the "stream list item" with locator attribute "Dummy Local File 3" should be displayed
        And the "stream list item" with locator attribute "Dummy Local File 4" should be displayed


        When the viewer projects main stream as source name containing "Dummy Local File 2"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 2 |
        When the viewer projects main stream as source name containing "Dummy Local File 3"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 3 |        
        When the viewer projects main stream as source name containing "Dummy Local File 4"
        And the "main view" should be displayed with following values
            | source name text | contains: Dummy Local File 4 |    

    @ignore #Bug - 311
    Scenario: Video toggle should be preserved after swaping the streams on Viewer
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns Off the "video of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text    | contains: local-file |
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
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns Off the "audio of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text    | contains: local-file |
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
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns Off the "playback of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text       | contains: local-file |
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
        
        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |

        When the viewer turns Off the "video of main view"
        And the viewer turns Off the "audio of main view"
        And the viewer turns Off the "playback of main view"
        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text       | contains: local-file |
            | vido button status     | Off              |
            | audio button status    | Off              |
            | playback button status | Off              |

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        When the viewer projects main stream as source name containing "local-file"
        And the viewer turns On the "playback of main view"

        And the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        And the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text       | contains: local-file |
            | vido button status     | Off              |
            | audio button status    | Off              |
