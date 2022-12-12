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
        And the "setting button" should be displayed
        And the "setting button" should be enabled
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

    Scenario: Publisher should be presented with main video view
        Given a publisher is on the "preview" page
        Then the "video view" should be displayed
        And the "video view" should be in Normal size
        And the "video view microphone" should be displayed
        And the "video view microphone" should be enabled
        And the "video view camera" should be displayed
        And the "video view camera" should be enabled
        And the "video view source name" text should contain "fake"
        And the "video view full screen button" should not be displayed

    Scenario: Publisher should be not presented with share screen view by default
        Given a publisher is on the "preview" page
        Then the "screen view" should not be displayed

    Scenario: Publisher should be able to turn off and on the camera
        Given a publisher is on the "preview" page
        Then the "video view camera" should be turned On
        When the publisher turns Off the "video view camera"
        Then the "video view camera" should be turned Off
        When the publisher turns On the "video view camera"
        Then the "video view camera" should be turned On

    Scenario: Publisher should be able to turn off and on the microphone
        Given a publisher is on the "preview" page
        Then the "video view microphone" should be turned On
        When the publisher turns Off the "video view microphone"
        Then the "video view microphone" should be turned Off
        When the publisher turns On the "video view microphone"
        Then the "video view microphone" should be turned On

    Scenario: Publisher should be able to turn off and on the camera and microphone
        Given a publisher is on the "preview" page
        Then the "video view camera" should be turned On
        And the "video view microphone" should be turned On
        When the publisher turns Off the "video view camera"
        And the publisher turns Off the "video view microphone"
        Then the "video view camera" should be turned Off
        And the "video view microphone" should be turned Off
        When the publisher turns On the "video view camera"
        And the publisher turns On the "video view microphone"
        Then the "video view camera" should be turned On
        And the "video view microphone" should be turned On
  
    Scenario: Publisher should be presented with Share screen option under Add Sources
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        Then the "share screen button" should be visible
        And the "share screen button" should be enabled
        And the "add source menu" should contain "Share screen" options

    Scenario: Publisher should be able to share screen before starting the stream
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        
        Then the "screen view" should be displayed
        And the "screen view source name" text should be "screen"
        And the "screen view full screen button" should not be displayed
        And the "screen view stop share button" should be displayed
        And the "screen view stop share button" should be enabled
        And the "screen view" should be in Normal size

        Then the "video view" should be displayed
        And the "video view" should be in Normal size
        And the "video view microphone" should be displayed
        And the "video view microphone" should be enabled
        And the "video view camera" should be displayed
        And the "video view camera" should be enabled
        And the "video view source name" text should contain "fake"
        And the "video view full screen button" should not be displayed

        And the "add source button" should not be displayed
        And the "multi source label" should be displayed
        And the "multi source label" text should be "Multisource enabled"

    Scenario: Publisher should be able to stop share screen before starting the stream
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        Then the "screen view" should be displayed

        When the publisher clicks on the "screen view stop share button"
        Then the "screen view" should not be displayed

        Then the "video view" should be displayed
        And the "video view" should be in Normal size
        And the "video view microphone" should be displayed
        And the "video view microphone" should be enabled
        And the "video view camera" should be displayed
        And the "video view camera" should be enabled
        And the "video view source name" text should contain "fake"
        And the "video view full screen button" should not be displayed

        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "multi source label" should not be displayed

    Scenario: Publisher should be presented with Setting controls
        Given a publisher is on the "preview" page
        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        Then the "settings drawer title" text should be "Settings"
        Then the number of "settings dropdowns" count should be "5"

    Scenario: Publisher should be presented with camera selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "camera dropdown" should be displayed
        And the "camera dropdown" should be enabled
        And the "camera dropdown default" text should be "Camera  - fake_device_0"
        And the "camera dropdown options" should contain "fake_device_0" options

    Scenario: Publisher should be presented with microphone selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "microphone dropdown" should be displayed
        And the "microphone dropdown" should be enabled
        And the "microphone dropdown default" text should be "Microphone  - Fake Audio Input 1"
        And the "microphone dropdown options" should contain "Fake Audio Input 1,Fake Audio Input 2" options

    Scenario: Publisher should be presented with resolution selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "resolution dropdown" should be displayed
        And the "resolution dropdown" should be enabled
        And the "resolution dropdown default" text should be "Resolution  - 3840x2160"
        And the "resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options

    Scenario: Publisher should be presented with codec selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "codec dropdown" should be displayed
        And the "codec dropdown" should be enabled
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options

    Scenario: Publisher should be presented with bitrate selection dropdown under settings
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 Kbps,250 Kbps" options

    Scenario: Simulcast should be enabled by default with codec as h264
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "simulcast switch" should be displayed
        And the "simulcast switch" should be enabled
        And the "simulcast label" text should be "Simulcast"
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"

    Scenario: VP9 codec is available for streaming when simulcast is disabled
        Given a publisher is on the "preview" page
        And the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed

        Then the publisher turns Off the "simulcast" feature
        And the "simulcast" feature should be turned Off
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8,vp9" options

        Then the publisher turns On the "simulcast" feature
        And the "simulcast" feature should be turned On
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "codec dropdown options" should contain "h264,vp8" options


    # Without Screen Share
    Scenario: Publisher should be presented with different streaming control buttons after the live stream is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "go live button" should be displayed
        And the "go live button" should be enabled
        And the "go live button" text should be "GO LIVE"
        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "add source button" text should be "Add Source"
        And the "setting button" should be displayed
        And the "setting button" should be enabled
        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "stream info button" should not be displayed

    Scenario: Publisher should be presented with streaming information after the live stream is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed

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
        And the "video view" should be displayed
        
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        Then the "video view" should be displayed
        And the "video view" should be in Normal size
        And the "video view microphone" should be displayed
        And the "video view microphone" should be enabled
        And the "video view camera" should be displayed
        And the "video view camera" should be enabled
        And the "video view source name" text should contain "fake"
        And the "video view full screen button" should not be displayed


    # With Screen Share
    Scenario: Publisher should be presented with different streaming control buttons after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "go live button" should be displayed
        And the "go live button" should be enabled
        And the "go live button" text should be "GO LIVE"
        And the "add source button" should not be displayed
        And the "setting button" should be displayed
        And the "setting button" should be enabled
        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "stream info button" should not be displayed

    Scenario: Publisher should be presented with streaming information after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        Then the "streaming status dot" should not be displayed
        And the "multi source label" should be displayed
        And the "multi source label" text should be "Multisource enabled"
        And the "viewers count" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Get started"
        And the "page description" text should be "Setup your audio and video before going live."

    Scenario: Publisher should be presented with main video and screen view after the live stream is stopped with screen sharing
        Given a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed
        Then the "screen view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "video view" should be displayed
        And the "video view" should be in Normal size
        And the "video view microphone" should be displayed
        And the "video view microphone" should be enabled
        And the "video view camera" should be displayed
        And the "video view camera" should be enabled
        And the "video view source name" text should contain "fake"
        And the "video view full screen button" should not be displayed

        And the "screen view" should be displayed
        And the "screen view source name" text should be "screen"
        And the "screen view full screen button" should not be displayed
        And the "screen view stop share button" should be displayed
        And the "screen view stop share button" should be enabled
        And the "screen view" should be in Normal size


    # Settings are preserved
    Scenario: Publisher settings should be preserved after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        And the "video view" should be displayed

        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed
        And the "camera dropdown default" text should be "Camera  - fake_device_0"
        And the "microphone dropdown default" text should be "Microphone  - Fake Audio Input 1"
        And the "resolution dropdown default" text should be "Resolution  - 3840x2160"
        And the "codec dropdown default" text should be "Codec  - h264"
        And the "bitrate dropdown default" text should be "Bitrate  - Auto"
        And the "simulcast" feature should be turned On

    Scenario: Publisher settings should be preserved with Simulcast On when changed on preview page after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed

        When the publisher selects "Fake Audio Input 2" option from the "microphone dropdown"
        And the publisher selects "vp8" option from the "codec dropdown"
        And the publisher selects "1280x720" option from the "resolution dropdown"
        And the publisher selects "1 Mbps" option from the "bitrate dropdown"
        #And the publisher turns On the "simulcast" feature
        And the publisher clicks on the "settings close button"


        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed

        When the "camera dropdown default" text should be "Camera  - fake_device_0"
        And the "microphone dropdown default" text should be "Microphone  - Fake Audio Input 2"
        And the "resolution dropdown default" text should be "Resolution  - 1280x720"
        And the "codec dropdown default" text should be "Codec  - vp8"
        And the "bitrate dropdown default" text should be "Bitrate  - 1 Mbps"
        And the "simulcast" feature should be turned On

    Scenario: Publisher settings should be preserved with Simulcast Off when changed on preview page after the streaming is stopped
        Given a publisher is on the "preview" page
        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed

        When the publisher selects "Fake Audio Input 2" option from the "microphone dropdown"
        And the publisher turns Off the "simulcast" feature
        And the publisher selects "vp9" option from the "codec dropdown"
        And the publisher selects "854x480" option from the "resolution dropdown"
        And the publisher selects "2 Mbps" option from the "bitrate dropdown"
        And the publisher clicks on the "settings close button"

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        And the "stop button" should be displayed
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        When the publisher clicks on the "setting button"
        Then the "settings drawer" should be displayed

        When the "camera dropdown default" text should be "Camera  - fake_device_0"
        And the "microphone dropdown default" text should be "Microphone  - Fake Audio Input 2"
        And the "resolution dropdown default" text should be "Resolution  - 854x480"
        And the "codec dropdown default" text should be "Codec  - vp9"
        And the "bitrate dropdown default" text should be "Bitrate  - 2 Mbps"
        And the "simulcast" feature should be turned Off


    Scenario: Publisher should be able to copy the viewer link before going live for the broadcast
        Given a publisher is on the "preview" page
        When the publisher clicks on the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Link copied!"
        And the "invite button" text should be "Invite viewers"

    Scenario: Publisher should be able to see the tooltip for different controls
        Given a publisher is on the "preview" page
        When the publisher hovers the mouse over the "setting button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Settings"
        
        When the publisher hovers the mouse over the "video view camera"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle camera"

        When the publisher hovers the mouse over the "video view microphone"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Toggle microphone"

        When the publisher hovers the mouse over the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Copy link"

    #Scenario: Manual verify copied clipboard text for invite viewers
    # TODO: After hover tooltip should not be displayed