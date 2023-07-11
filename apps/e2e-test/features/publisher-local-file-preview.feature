@publisher
Feature: Publisher Local File Preview
    As a publisher
    I want to setup the local file stream configuration on Preview page
    So that I can local file stream with required configuration

    Background: Publisher local file preview page
        Given a publisher is on the "preview" page
        And the "camera view" should be displayed
        When the publisher adds "local" file source

    Scenario: Publisher should be presented with local file view
        Then the "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "screen view" should not be displayed

    Scenario: Publisher should be able to turn off and on the video of local file view
        Then the "video of local file view" should be turned On
        And the "local file view video mute image" should not be displayed

        When the publisher turns Off the "video of local file view"
        Then the "video of local file view" should be turned Off
        And the "local file view video mute image" should be displayed
        And the "camera view" should be displayed with default values
        
        When the publisher turns On the "video of local file view"
        And the publisher turns Off the "video of camera view"
        Then the "video of local file view" should be turned On
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | video button status | Off |

    Scenario: Publisher should be able to turn off and on the audio of local file view
        Then the "audio of local file view" should be turned On
        When the publisher turns Off the "audio of local file view"
        Then the "audio of local file view" should be turned Off
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values

        When the publisher turns On the "audio of local file view"
        When the publisher turns Off the "audio of camera view"
        Then the "audio of local file view" should be turned On
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | audio button status | Off |

    Scenario: Publisher should be able to turn off and on the video and audio of local file view
        Then the "video of local file view" should be turned On
        And the "audio of local file view" should be turned On
        When the publisher turns Off the "video of local file view"
        And the publisher turns Off the "audio of local file view"
        Then the "video of local file view" should be turned Off
        And the "audio of local file view" should be turned Off
        And the "local file view video mute image" should be displayed
        And the "camera view" should be displayed with default values

        When the publisher turns On the "video of local file view"
        And the publisher turns On the "audio of local file view"
        And the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        Then the "video of local file view" should be turned On
        And the "audio of local file view" should be turned On
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with following values
            | video button status | Off |
            | audio button status | Off |

    Scenario: Publisher should be able to turn off and on the playback of local file view
        Then the "playback of local file view" should be turned On
        And the "local file view video mute image" should not be displayed

        When the publisher turns Off the "playback of local file view"
        Then the "playback of local file view" should be turned Off
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values
        
        When the publisher turns On the "playback of local file view"
        Then the "playback of local file view" should be turned On
        And the "local file view video mute image" should not be displayed
        And the "camera view" should be displayed with default values


    Scenario: Publisher should be presented with Setting controls under local file View
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed
        And the "settings title" text should be "Stream settings"
        And the number of "settings dropdowns" count should be "2"
        And the publisher clicks on the "settings close button"
        And the "local file view" setting should be displayed with default values

    Scenario: Publisher should be not presented with resolution selection dropdown under settings
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed
        And the "resolution dropdown" should not be displayed

    Scenario: Publisher should be presented with codec selection dropdown under settings
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed
        And the "codec dropdown" should be displayed
        And the "codec dropdown" should be enabled
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be presented with bitrate selection dropdown under settings
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 kbps,250 kbps" options

    Scenario: Simulcast should be enabled by default with codec as h264
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed
        And the "simulcast switch" should be displayed
        And the "simulcast switch" should be enabled
        And the "simulcast label" text should be "Simulcast"
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"

    Scenario: VP9 codec is available for streaming when simulcast is disabled
        When the publisher clicks on the "local file view setting button"
        Then the "settings popup" should be displayed

        Then the publisher turns Off the "simulcast" feature
        And the "simulcast" feature should be turned Off
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8,vp9" options

        Then the publisher turns On the "simulcast" feature
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be able to see the tooltip for different controls under local file view
        When the publisher hovers the mouse over the "local file view setting button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Stream settings"

        When the publisher hovers the mouse over the "local file view video button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle video"

        When the publisher hovers the mouse over the "local file view audio button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle audio"

        When the publisher hovers the mouse over the "local file view playback button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle playback"

        When the publisher hovers the mouse over the "local file view go live button"
        Then the "tooltip" should not be displayed

    Scenario: Publisher settings should be preserved on preview page with simulcast <simulcast>
        When the publisher configures "local file view" setting with the following values only
            | source name  | Dummy Local File   |
            | simulcast    | <simulcast>        |
            | codec        | <codec>            |
            | bitrate      | 1 Mbps             |
        Then the "local file view" setting should be displayed with following values only
            | source name  | Dummy Local File   |
            | simulcast    | <simulcast>        |
            | codec        | Codec  - <codec>   |
            | bitrate      | Bitrate  - 1 Mbps  |
        And the "camera view" setting should be displayed with default values
    Examples:
        |  simulcast  |  codec  |
        |  On         |  vp8    |
        |  Off        |  vp9    |

    Scenario: Publisher should be able to close camera source with 2 sources
        Then the "camera view" should be displayed with default values
        And the "local file view" should be displayed with default values

        When the publisher clicks on the "camera view close button"
        Then the "camera view" should not be displayed
        And the "local file view" should be displayed with following values
            | close button | hidden |

    Scenario: Publisher should be able to close local file source with 2 sources
        Then the "camera view" should be displayed with default values
        And the "local file view" should be displayed with default values

        When the publisher clicks on the "local file view close button"
        Then the "local file view" should not be displayed
        And the "camera view" should be displayed with following values
            | close button | hidden |

    Scenario: Publisher should be able to close local file source and add it again
        Then the "camera view" should be displayed with default values
        And the "local file view" should be displayed with default values

        When the publisher clicks on the "local file view close button"
        Then the "local file view" should not be displayed

        When the publisher adds "local" file source
        Then the "local file view" should be displayed with default values
        And the "camera view" should be displayed with default values

    Scenario: Changing the camera settings should not change the local file settings with simulcast <simulcast>
        When the publisher configures "camera view" setting with the following values only
            | source name  | BuiltIn Camera |
            | simulcast    | <simulcast>    |
            | codec        | <codec>        |
            | resolution   | 1280x720       |
            | bitrate      | 1 Mbps         |
        Then the "camera view" setting should be displayed with following values only
            | source name  | BuiltIn Camera         |
            | simulcast    | <simulcast>            |
            | codec        | Codec  - <codec>       |
            | resolution   | Resolution  - 1280x720 |
            | bitrate      | Bitrate  - 1 Mbps      |
        Then the "local file view" setting should be displayed with default values
    Examples:
        |  simulcast  |  codec  |
        |  On         |  vp8    |
        |  Off        |  vp9    |

    @ignore #Bug - 384
    Scenario: Publisher should be able to add multiple local file source
        When the publisher adds "local" file source
        Then the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values

        And the "1st" "local file view" should be displayed with default values
        And the "1st" "local file view close button" should be displayed
        And the "1st" "local file view" setting should be displayed with default values

        And the "2nd" "local file view" should be displayed with default values
        And the "2nd" "local file view close button" should be displayed
        And the "2nd" "local file view" setting should be displayed with default values

        When the publisher adds "local" file source
        Then the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values

        And the "1st" "local file view" should be displayed with default values
        And the "1st" "local file view close button" should be displayed
        And the "1st" "local file view" setting should be displayed with default values

        And the "2nd" "local file view" should be displayed with default values
        And the "2nd" "local file view close button" should be displayed
        And the "2nd" "local file view" setting should be displayed with default values

        And the "3rd" "local file view" should be displayed with default values
        And the "3rd" "local file view close button" should be displayed
        And the "3rd" "local file view" setting should be displayed with default values

        And the "add source button" should be disabled

    Scenario: Changing the local file settings should not change the another local file settings
        When the publisher adds "local" file source
        And the publisher adds "local" file source
        When the publisher configures "1st" "local file view" setting with the following values only
            | source name  | Dummy Local File 1   |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |
        And the publisher configures "2nd" "local file view" setting with the following values only
            | source name  | Dummy Local File 2   |
            | simulcast    | Off                  |
            | codec        | vp9                  |
            | bitrate      | 1 Mbps               |
        And the publisher configures "3rd" "local file view" setting with the following values only
            | source name  | Dummy Local File 3   |
            | simulcast    | On                   |
            | codec        | h264                 |

        Then the "camera view" setting should be displayed with default values
        Then the "1st" "local file view" setting should be displayed with following values only
            | source name  | Dummy Local File 1   |
            | simulcast    | On                   |
            | codec        | Codec  - vp8         |
            | bitrate      | Bitrate  - 2 Mbps    |
        Then the "2nd" "local file view" setting should be displayed with following values only
            | source name  | Dummy Local File 2   |
            | simulcast    | Off                  |
            | codec        | Codec  - vp9         |
            | bitrate      | Bitrate  - 1 Mbps    |
        Then the "3rd" "local file view" setting should be displayed with following values only
            | source name  | Dummy Local File 3   |
            | simulcast    | On                   |
            | codec        | Codec  - h264        |
            | bitrate      | Bitrate  - Auto      |

    #TODO: Verify states of the audio and video for different streams
    #TODO: Playback button