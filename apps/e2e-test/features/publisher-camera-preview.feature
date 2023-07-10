@publisher
Feature: Publisher Camera Preview
    As a publisher
    I want to setup the cmaera stream configuration on Preview page
    So that I can camera stream with required configuration

    Background: Publisher camera preiew page
        Given a publisher is on the "preview" page

    Scenario: Publisher should be presented with camera view
        Then the "camera view" should be displayed with following values
            | close button | hidden |

    Scenario: Publisher should be able to turn off and on the video of camera view
        Then the "video of camera view" should be turned On
        And the "camera view video mute image" should not be displayed

        When the publisher turns Off the "video of camera view"
        Then the "video of camera view" should be turned Off
        And the "camera view video mute image" should be displayed
        
        When the publisher turns On the "video of camera view"
        Then the "video of camera view" should be turned On
        And the "camera view video mute image" should not be displayed 

    Scenario: Publisher should be able to turn off and on the audio of camera view
        Then the "audio of camera view" should be turned On
        When the publisher turns Off the "audio of camera view"
        Then the "audio of camera view" should be turned Off
        And the "camera view video mute image" should not be displayed 

        When the publisher turns On the "audio of camera view"
        Then the "audio of camera view" should be turned On
        And the "camera view video mute image" should not be displayed 

    Scenario: Publisher should be able to turn off and on the video and audio of camera view
        Then the "video of camera view" should be turned On
        And the "audio of camera view" should be turned On
        When the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        Then the "video of camera view" should be turned Off
        And the "audio of camera view" should be turned Off
        And the "camera view video mute image" should be displayed

        When the publisher turns On the "video of camera view"
        And the publisher turns On the "audio of camera view"
        Then the "video of camera view" should be turned On
        And the "audio of camera view" should be turned On
        And the "camera view video mute image" should not be displayed 

    Scenario: Publisher should be presented with Setting controls under Camera View
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "settings title" text should be "Stream settings"
        And the number of "settings dropdowns" count should be "3"
        And the publisher clicks on the "settings close button"
        And the "camera view" setting should be displayed with default values

    Scenario: Publisher should be presented with resolution selection dropdown under settings
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "resolution dropdown" should be displayed
        And the "resolution dropdown" should be enabled
        And the "resolution dropdown default" text should be "Resolution  - 640x480"
        And the "resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options

    Scenario: Publisher should be presented with codec selection dropdown under settings
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "codec dropdown" should be displayed
        And the "codec dropdown" should be enabled
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be presented with bitrate selection dropdown under settings
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 kbps,250 kbps" options

    Scenario: Simulcast should be enabled by default with codec as h264
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "simulcast switch" should be displayed
        And the "simulcast switch" should be enabled
        And the "simulcast label" text should be "Simulcast"
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"

    Scenario: VP9 codec is available for streaming when simulcast is disabled
        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed

        Then the publisher turns Off the "simulcast" feature
        And the "simulcast" feature should be turned Off
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8,vp9" options

        Then the publisher turns On the "simulcast" feature
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be able to see the tooltip for different controls under camera view
        When the publisher hovers the mouse over the "camera view setting button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Stream settings"

        When the publisher hovers the mouse over the "camera view video button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle camera"

        When the publisher hovers the mouse over the "camera view audio button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle microphone"

        When the publisher hovers the mouse over the "camera view go live button"
        Then the "tooltip" should not be displayed

    Scenario: Publisher settings should be preserved on preview page
        When the publisher configures "camera view" setting with the following values only
            | source name  | BuiltIn Camera |
            | simulcast    | On             |
            | codec        | vp8            |
            | resolution   | 1280x720       |
            | bitrate      | 1 Mbps         |
        Then the "camera view" setting should be displayed with following values only
            | source name  | BuiltIn Camera         |
            | simulcast    | On                     |
            | codec        | Codec  - vp8           |
            | resolution   | Resolution  - 1280x720 |
            | bitrate      | Bitrate  - 1 Mbps      |
