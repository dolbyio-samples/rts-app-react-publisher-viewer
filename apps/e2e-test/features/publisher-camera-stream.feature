@publisher
Feature: Publisher streaming with camera only
    As a publisher
    I want to do live streaming for an event with camera only

    Background: Publisher camera preiew page
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app

    Scenario: Verify the header information, settings options, camera view, stream stats and settings when streaming with camera
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "header" should be displayed with default values
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed

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
        And the "header" should be displayed with default values
        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "header" should be displayed with default values
        And the "main view" should not be displayed

    Scenario: Stream duration is not zero when stream is live
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

    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming
        # Publisher App
        When the publisher turns Off the "video of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | video button status     | Off    |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        And the "main view" should be displayed with default values

         # Screenshot Validations
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_video_toggle_off_1.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_video_toggle_off_tile_1.png"
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_video_toggle_off_2.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_video_toggle_off_tile_2.png"
        And the image "pub_camera_video_toggle_off_1.png" should be equal to image "pub_camera_video_toggle_off_2.png"
        And the image "pub_camera_video_toggle_off_tile_1.png" should be equal to image "pub_camera_video_toggle_off_tile_2.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of camera view"
        Then the "camera view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        And the "main view" should be displayed with default values
        
        # Screenshot Validations
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_video_toggle_off_3.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_video_toggle_off_tile_3.png"
        And the image "pub_camera_video_toggle_off_1.png" should not be equal to image "pub_camera_video_toggle_off_3.png"
        And the image "pub_camera_video_toggle_off_tile_1.png" should not be equal to image "pub_camera_video_toggle_off_tile_3.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "video of camera view"
        And the "camera view" should be displayed with following values
            | video button status     | Off     |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "stream list loading items" should not be displayed
        And the "main view" should be displayed with default values

        # Screenshot Validations
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_video_toggle_off_4.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_video_toggle_off_tile_4.png"
        And the image "pub_camera_video_toggle_off_1.png" should be equal to image "pub_camera_video_toggle_off_4.png"
        And the image "pub_camera_video_toggle_off_tile_1.png" should be equal to image "pub_camera_video_toggle_off_tile_4.png"

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming
        # Publisher App
        When the publisher turns Off the "audio of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | audio button status | Off  |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        And the "main view" should be displayed with default values
        
        # Screenshot Validations
        And take the screenshot of "main view" at path "pub_camera_audio_toggle_off_1.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_toggle_off_tile_1.png"
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_audio_toggle_off_2.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_toggle_off_tile_2.png"
        And the image "pub_camera_audio_toggle_off_1.png" should not be equal to image "pub_camera_audio_toggle_off_2.png"
        And the image "pub_camera_audio_toggle_off_tile_1.png" should not be equal to image "pub_camera_audio_toggle_off_tile_2.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with default values
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with default values
        And the "stream list loading items" should not be displayed
        
        # Screenshot Validations
        And take the screenshot of "main view" at path "pub_camera_audio_toggle_off_3.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_toggle_off_tile_3.png"
        And the image "pub_camera_audio_toggle_off_1.png" should not be equal to image "pub_camera_audio_toggle_off_3.png"
        And the image "pub_camera_audio_toggle_off_tile_1.png" should not be equal to image "pub_camera_audio_toggle_off_tile_3.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | audio button status | Off  |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with default values
        And the "stream list loading items" should not be displayed

        # Screenshot Validations
        And take the screenshot of "main view" at path "pub_camera_audio_toggle_off_4.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_toggle_off_tile_4.png"
        And the image "pub_camera_audio_toggle_off_1.png" should not be equal to image "pub_camera_audio_toggle_off_4.png"
        And the image "pub_camera_audio_toggle_off_tile_1.png" should not be equal to image "pub_camera_audio_toggle_off_tile_4.png"

    Scenario: Publisher should be able to start streaming with microphone/camera Off and toggle microphone/camera during streaming
        # Viewer App
        And the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "stream list loading items" should not be displayed
        And the "main view" should be displayed with default values

        # Screenshot Validations
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_audio_video_toggle_off_1.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_video_tile_toggle_off_1.png"
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_audio_video_toggle_off_2.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_video_tile_toggle_off_2.png"
        And the image "pub_camera_audio_video_toggle_off_1.png" should be equal to image "pub_camera_audio_video_toggle_off_2.png"
        And the image "pub_camera_audio_video_tile_toggle_off_1.png" should be equal to image "pub_camera_audio_video_tile_toggle_off_2.png"

        # Viewer App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of camera view"
        And the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | video button status | On                 |
            | audio button status | On                 |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with default values
        And the "stream list loading items" should not be displayed
        
        # Screenshot Validations
        And wait for "1" seconds
        And take the screenshot of "main view" at path "pub_camera_audio_video_toggle_off_3.png"
        And take the screenshot of "camera tile list item" at path "pub_camera_audio_video_tile_toggle_off_3.png"
        And the image "pub_camera_audio_video_toggle_off_1.png" should not be equal to image "pub_camera_audio_video_toggle_off_3.png"
        And the image "pub_camera_audio_video_tile_toggle_off_1.png" should not be equal to image "pub_camera_audio_video_tile_toggle_off_3.png"

    Scenario: Publisher should be presented with Resolution and Bitrate Setting controls when streaming with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "settings title" text should be "Stream settings"
        And the number of "settings dropdowns" count should be "2"
        And the "resolution dropdown" should be displayed
        And the "resolution dropdown" should be enabled
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 Kbps,250 Kbps" options

        And the "source name input" should not be displayed
        And the "codec dropdown" should not be displayed
        And the "simulcast switch" should not be displayed

    Scenario: Viewer should be presented with quality Setting controls when streaming with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with default values

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "1"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
        And the "quality dropdown options" should contain "Auto,High,Low" options

    Scenario: Verify source name is reflected correctly after modifing it when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | source name |  BuiltIn Camera |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | source name text   | BuiltIn Camera     |
            | stream info button | displayed\|enabled |
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text   | BuiltIn Camera     |
        
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "stream list item" with locator attribute "BuiltIn Camera" should be displayed

    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed    

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "1"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
        And the "quality dropdown options" should equal to "Auto" options
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |
        |  vp9    |
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values

        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"
        And the "camera tile list item" should be displayed

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "1"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
        And the "quality dropdown options" should contain "Auto,High,Low" options
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |