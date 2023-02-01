@publisher
Feature: Publisher streaming with Screen share
    As a publisher
    I want to do live streaming for an event with screen share

    Background: Add screen source on preview page
        Given a publisher is on the "preview" page
        When the publisher adds "screen" source

    Scenario: Verify the header information, settings options, camera view, stream stats when streaming with screen share
        Then the "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values 
        
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "streaming header" should be displayed with following values
            | multi source label       |  displayed           |
            | multi source label text  |  Multisource enabled |

        And the "screen view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "screen view" setting should be displayed with following values only
            | bitrate    | Bitrate  - Auto         |
        And the "screen view" stream stats with quality tabs should be displayed with default values

        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - 3840x2160 |
            | bitrate    | Bitrate  - Auto         |
        And the "camera view" stream stats with quality tabs should be displayed with default values

    Scenario: Verify the local file view should not be displayed when streaming with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" should be displayed
        And the "local file view" should not be displayed

    Scenario: Verify the publisher is redirected to preview page when streaming is stopped
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "screen view" should be displayed with default values
        And the "camera view" should be displayed with default values

    Scenario: Stream duration is not zero when stream is live with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And wait for "5" seconds
        And the "streaming header" should be displayed with following values only
            | timer text | regex: ^00:00:[0][4-9]$ |

    Scenario: Publisher should be able to toggle camera and microphone when streaming with screen share
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page

        When the publisher turns Off the "camera of screen view"
        And the publisher turns Off the "microphone of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | Off                |
            | microphone button status | Off                |

        When the publisher turns On the "camera of screen view"
        And the publisher turns On the "microphone of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | On                |
            | microphone button status | On                |

    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming with screen share
        When the publisher turns Off the "camera of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" should be displayed with following values
            | camera button status     | Off                |
            | microphone button status | On                 |
            | stream info button       | displayed\|enabled |

        When the publisher turns On the "camera of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | On                 |
            | microphone button status | On                 |

        When the publisher turns Off the "camera of screen view"
        Then the "screen view" should be displayed with following values only
            | camera button status     | Off                |
            | microphone button status | On                 |

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming with screen share
        When the publisher turns Off the "microphone of screen view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "screen view" should be displayed with following values
            | camera button status     | On                 |
            | microphone button status | Off                |
            | stream info button       | displayed\|enabled |

        When the publisher turns On the "microphone of screen view"
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