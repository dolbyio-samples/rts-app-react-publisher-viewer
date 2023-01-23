@publisher
Feature: Publisher Preview - Not Live
    As a publisher
    I want to setup the stream configuration on Preview page
    So that I can stream with required configuration

    Scenario: Publisher should be presented with different streaming control buttons to set configuration
        Given a publisher is on the "preview" page
        Then the "go live button" should be displayed
        And the "go live button" should be enabled
        And the "go live button" text should be "GO LIVE"
        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "add source button" text should be "Add Source"
        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "invite button" text should be "Invite viewers"
        And the "stream info button" should not be displayed

    Scenario: Publisher should be presented with streaming information
        Given a publisher is on the "preview" page
        Then the "streaming status dot" should not be displayed
        And the "multi source label" should not be displayed
        And the "viewers count" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Get started"
        And the "page description" text should be "Setup your audio and video before going live."

    Scenario: Publisher should be presented with camera view
        Given a publisher is on the "preview" page
        Then the "camera view" should be displayed
        And the "camera view" should be in Normal size
        And the "camera view setting button" should be displayed
        And the "camera view setting button" should be enabled
        And the "camera view microphone button" should be displayed
        And the "camera view microphone button" should be enabled
        And the "camera view camera button" should be displayed
        And the "camera view camera button" should be enabled
        And the "camera view source name" text should contain "fake"
        And the "camera view full screen button" should not be displayed

    Scenario: Publisher should be not presented with share screen view by default
        Given a publisher is on the "preview" page
        Then the "screen view" should not be displayed
        And the "camera view" should be displayed

    # TODO: issue 195
    # Scenario: Publisher should be able to turn off and on the camera
    #     Given a publisher is on the "preview" page
    #     Then the "camera of camera view" should be turned On
    #     When the publisher turns Off the "camera of camera view"
    #     Then the "camera of camera view" should be turned Off
    #     When the publisher turns On the "camera of camera view"
    #     Then the "camera of camera view" should be turned On

    Scenario: Publisher should be able to turn off and on the microphone
        Given a publisher is on the "preview" page
        Then the "microphone of camera view" should be turned On
        When the publisher turns Off the "microphone of camera view"
        Then the "microphone of camera view" should be turned Off
        When the publisher turns On the "microphone of camera view"
        Then the "microphone of camera view" should be turned On

    # TODO: issue 195
    # Scenario: Publisher should be able to turn off and on the camera and microphone
    #     Given a publisher is on the "preview" page
    #     Then the "camera of camera view" should be turned On
    #     And the "microphone of camera view" should be turned On
    #     When the publisher turns Off the "camera of camera view"
    #     And the publisher turns Off the "microphone of camera view"
    #     Then the "camera of camera view" should be turned Off
    #     And the "microphone of camera view" should be turned Off
    #     When the publisher turns On the "camera of camera view"
    #     And the publisher turns On the "microphone of camera view"
    #     Then the "camera of camera view" should be turned On
    #     And the "microphone of camera view" should be turned On

    Scenario: Publisher should be presented with Share screen option under Add Sources
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        Then the "share screen button" should be visible
        And the "share screen button" should be enabled
        And the "add source menu" should contain "Share screen,Add cameras,Stream local file" options

    # Bug/Issue: #200
    Scenario: Publisher should be able to share screen before starting the stream
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"

        Then the "screen view" should be displayed
        And the "screen view" should be in Normal size
        And the "screen view source name" text should contain "screen"
        And the "screen view setting button" should be displayed
        And the "screen view setting button" should be enabled
        # TODO: issue 195
        # And the "screen view stop share button" should be displayed
        # And the "screen view stop share button" should be enabled
        And the "screen view full screen button" should not be displayed

        Then the "camera view" should be displayed
        And the "camera view" should be in Normal size
        And the "camera view setting button" should be displayed
        And the "camera view setting button" should be enabled
        And the "camera view microphone button" should be displayed
        And the "camera view microphone button" should be enabled
        And the "camera view camera button" should be displayed
        And the "camera view camera button" should be enabled
        And the "camera view source name" text should contain "fake"
        And the "camera view full screen button" should not be displayed

    # TODO: Bug No #200
    # And the "multi source label" should be displayed
    # And the "multi source label" text should be "Multisource enabled"

    Scenario: Publisher should be able to stop share screen before starting the stream
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        Then the "screen view" should be displayed

        # TODO: issue 195
        # When the publisher clicks on the "screen view stop share button"
        # Then the "screen view" should not be displayed

        Then the "camera view" should be displayed
        And the "camera view" should be in Normal size
        And the "camera view microphone button" should be displayed
        And the "camera view microphone button" should be enabled
        And the "camera view camera button" should be displayed
        And the "camera view camera button" should be enabled
        And the "camera view setting button" should be displayed
        And the "camera view setting button" should be enabled
        And the "camera view source name" text should contain "fake"
        And the "camera view full screen button" should not be displayed

        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "multi source label" should not be displayed

    Scenario: Publisher should be presented with Setting controls under Camera View
        Given a publisher is on the "preview" page
        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        Then the "camera view settings title" text should be "Settings"
        Then the number of "camera view settings dropdowns" count should be "3"

    Scenario: Publisher should be presented with resolution selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view resolution dropdown" should be displayed
        And the "camera view resolution dropdown" should be enabled
        And the "camera view resolution dropdown default" text should be "Resolution  - 3840x2160"
        And the "camera view resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options

    Scenario: Publisher should be presented with codec selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view codec dropdown" should be displayed
        And the "camera view codec dropdown" should be enabled
        And the "camera view codec dropdown default" text should be "Codec  - h264"
        And the "camera view codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be presented with bitrate selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view bitrate dropdown" should be displayed
        And the "camera view bitrate dropdown" should be enabled
        And the "camera view bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "camera view bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 Kbps,250 Kbps" options

    Scenario: Simulcast should be enabled by default with codec as h264
        Given a publisher is on the "preview" page
        And the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view simulcast switch" should be displayed
        And the "camera view simulcast switch" should be enabled
        And the "camera view simulcast label" text should be "Simulcast"
        And the "camera view simulcast" feature should be turned On
        And the "camera view codec dropdown default" text should be "Codec  - h264"

    Scenario: VP9 codec is available for streaming when simulcast is disabled
        Given a publisher is on the "preview" page
        And the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed

        Then the publisher turns Off the "camera view simulcast" feature
        And the "camera view simulcast" feature should be turned Off
        And the "camera view codec dropdown default" text should be "Codec  - h264"
        And the "camera view codec dropdown options" should contain "h264,vp8,vp9" options

        Then the publisher turns On the "camera view simulcast" feature
        And the "camera view simulcast" feature should be turned On
        And the "camera view codec dropdown default" text should be "Codec  - h264"
        And the "camera view codec dropdown options" should contain "h264,vp8" options


    # Without Screen Share
    Scenario: Publisher should be presented with different streaming control buttons after the live stream is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "go live button" should be displayed
        And the "go live button" should be enabled
        And the "go live button" text should be "GO LIVE"
        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "add source button" text should be "Add Source"
        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "stream info button" should not be displayed

    Scenario: Publisher should be presented with streaming information after the live stream is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "streaming status dot" should not be displayed
        And the "multi source label" should not be displayed
        And the "viewers count" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Get started"
        And the "page description" text should be "Setup your audio and video before going live."

    Scenario: Publisher should be presented with main video view after the live stream is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        Then the "camera view" should be displayed
        And the "camera view" should be in Normal size
        And the "camera view microphone button" should be displayed
        And the "camera view microphone button" should be enabled
        And the "camera view camera button" should be displayed
        And the "camera view camera button" should be enabled
        And the "camera view setting button" should be displayed
        And the "camera view setting button" should be enabled
        And the "camera view source name" text should contain "fake"
        And the "camera view full screen button" should not be displayed


    # With Screen Share
    Scenario: Publisher should be presented with different streaming control buttons after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "go live button" should be displayed
        And the "go live button" should be enabled
        And the "go live button" text should be "GO LIVE"
        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "stream info button" should not be displayed

    # Bug/Issue: #200
    Scenario: Publisher should be presented with streaming information after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        Then the "streaming status dot" should not be displayed
        # TODO: Bug No #200
        # And the "multi source label" should be displayed
        # And the "multi source label" text should be "Multisource enabled"
        And the "viewers count" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Get started"
        And the "page description" text should be "Setup your audio and video before going live."

    Scenario: Publisher should be presented with main video and screen view after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "camera view" should be displayed
        And the "camera view" should be in Normal size
        And the "camera view microphone button" should be displayed
        And the "camera view microphone button" should be enabled
        And the "camera view camera button" should be displayed
        And the "camera view camera button" should be enabled
        And the "camera view setting button" should be displayed
        And the "camera view setting button" should be enabled
        And the "camera view source name" text should contain "fake"
        And the "camera view full screen button" should not be displayed

        And the "screen view" should be displayed
        And the "screen view" should be in Normal size
        And the "screen view setting button" should be displayed
        And the "screen view setting button" should be enabled
        # TODO: issue 195
        # And the "screen view stop share button" should be displayed
        # And the "screen view stop share button" should be enabled
        And the "screen view source name" text should contain "screen"
        And the "screen view full screen button" should not be displayed


    # Settings are preserved
    Scenario: Publisher settings should be preserved after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "camera view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed
        And the "camera view resolution dropdown default" text should be "Resolution  - 3840x2160"
        And the "camera view codec dropdown default" text should be "Codec  - h264"
        And the "camera view bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "camera view simulcast" feature should be turned On

    Scenario: Publisher settings should be preserved with Simulcast On when changed on preview page after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed

        When the publisher selects "vp8" option from the "camera view codec dropdown"
        And the publisher selects "1280x720" option from the "resolution dropdown"
        And the publisher selects "1 Mbps" option from the "camera view bitrate dropdown"
        # And the publisher turns On the "camera view simulcast" feature
        And the publisher clicks on the "camera view settings close button"


        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed

        When the "camera view resolution dropdown default" text should be "Resolution  - 1280x720"
        And the "camera view codec dropdown default" text should be "Codec  - vp8"
        And the "camera view bitrate dropdown default" text should be "Bitrate  - 1 Mbps"
        And the "camera view simulcast" feature should be turned On

    Scenario: Publisher settings should be preserved with Simulcast Off when changed on preview page after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed

        When the publisher turns Off the "camera view simulcast" feature
        And the publisher selects "vp9" option from the "camera view codec dropdown"
        And the publisher selects "640x480" option from the "camera view resolution dropdown"
        And the publisher selects "2 Mbps" option from the "camera view bitrate dropdown"
        And the publisher clicks on the "camera view settings close button"

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "camera view setting button"
        Then the "camera view settings" should be displayed

        When the "camera view resolution dropdown default" text should be "Resolution  - 640x480"
        And the "camera view codec dropdown default" text should be "Codec  - vp9"
        And the "camera view bitrate dropdown default" text should be "Bitrate  - 2 Mbps"
        And the "camera view simulcast" should not be displayed
    # TODO: Change in implementation
    # And the "camera view simulcast" feature should be turned Off

    Scenario: Publisher should be able to copy the viewer link before going live for the broadcast
        Given a publisher is on the "preview" page
        When the publisher clicks on the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Link copied!"
        And the "invite button" text should be "Invite viewers"

    @local
    Scenario: Publisher should be able to get the same viewer link when copied mulitple times before going live for the broadcast
        Given a publisher is on the "preview" page
        When the publisher clicks on the "invite button"
        Then the copied clipboard text should contain "^${ViewerBaseURL}/\?streamAccountId=\w+&streamName=\w+$"
        Then store the copied clipboard text in "invite_link_1" variable
        Then wait for "2" seconds
        When the publisher clicks on the "invite button"
        Then the copied clipboard text should be equal to the stored "invite_link_1" variable

    Scenario: Publisher should be able to see the tooltip for different controls
        Given a publisher is on the "preview" page
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "camera view setting button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Settings"
        When the publisher hovers the mouse over the "go live button"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "camera view camera button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle camera"
        When the publisher hovers the mouse over the "timer"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "camera view microphone button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle microphone"
        When the publisher hovers the mouse over the "company name"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Copy link"
        When the publisher hovers the mouse over the "add source button"
        Then the "tooltip" should not be displayed
