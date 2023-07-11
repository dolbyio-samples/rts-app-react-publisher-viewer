@ignore
Feature: Publisher streaming with camera only
    As a publisher
    I want to do live streaming for an event with camera only

    Background: Publisher camera preiew page
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app

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

    Scenario: Viewer should be able to toggle video on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with default values

         # Screenshot Validations
        And take the screenshot of "main view" at path "viewer_camera_video_toggle_on_1.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_video_toggle_on_tile_1.png"
        When the viewer turns Off the "video of main view"
        Then the "main view" should be displayed with following values
            | video button status | Off |
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_video_toggle_off_2.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_video_toggle_on_tile_2.png"
        And the image "viewer_camera_video_toggle_on_1.png" should not be equal to image "viewer_camera_video_toggle_off_2.png"
        And the image "viewer_camera_video_toggle_on_tile_1.png" should not be equal to image "viewer_camera_video_toggle_on_tile_2.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_video_toggle_off_3.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_video_toggle_on_tile_3.png"
        And the image "viewer_camera_video_toggle_off_2.png" should be equal to image "viewer_camera_video_toggle_off_3.png"
        And the image "viewer_camera_video_toggle_on_tile_1.png" should not be equal to image "viewer_camera_video_toggle_on_tile_3.png"

        When the viewer turns On the "video of main view"
        Then the "main view" should be displayed with default values
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_video_toggle_on_4.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_video_toggle_on_tile_4.png"
        And the image "viewer_camera_video_toggle_off_3.png" should not be equal to image "viewer_camera_video_toggle_on_4.png"
        And the image "viewer_camera_video_toggle_on_tile_3.png" should not be equal to image "viewer_camera_video_toggle_on_tile_4.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle playback on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with default values

        # Screenshot Validations
        And take the screenshot of "main view" at path "viewer_camera_playback_toggle_on_1.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_playback_toggle_on_tile_1.png"
        When the viewer turns Off the "playback of main view"
        Then the "main view" should be displayed with following values
            | playback button status | Off |
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_playback_toggle_off_2.png"
        And the image "viewer_camera_playback_toggle_on_1.png" should not be equal to image "viewer_camera_playback_toggle_off_2.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_playback_toggle_on_tile_2.png"
        And the image "viewer_camera_playback_toggle_on_tile_1.png" should not be equal to image "viewer_camera_playback_toggle_on_tile_2.png"

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_playback_toggle_off_3.png"
        And the image "viewer_camera_playback_toggle_off_2.png" should be equal to image "viewer_camera_playback_toggle_off_3.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_playback_toggle_on_tile_3.png"
        And the image "viewer_camera_playback_toggle_on_tile_1.png" should not be equal to image "viewer_camera_playback_toggle_on_tile_3.png"

        When the viewer turns On the "playback of main view"
        Then the "main view" should be displayed with default values
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_playback_toggle_on_4.png"
        And the image "viewer_camera_playback_toggle_off_3.png" should not be equal to image "viewer_camera_playback_toggle_on_4.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_playback_toggle_on_tile_4.png"
        And the image "viewer_camera_playback_toggle_on_tile_3.png" should not be equal to image "viewer_camera_playback_toggle_on_tile_4.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

    Scenario: Viewer should be able to toggle audio on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with default values

        # Screenshot Validations
        And take the screenshot of "main view" at path "viewer_camera_audio_toggle_off_1.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_audio_toggle_off_tile_1.png"
        When the viewer turns On the "audio of main view"
        Then the "main view" should be displayed with following values
            | audio button status | On |
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_audio_toggle_on_2.png"
        And the image "viewer_camera_audio_toggle_off_1.png" should not be equal to image "viewer_camera_audio_toggle_on_2.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_audio_toggle_on_tile_2.png"
        And the image "viewer_camera_audio_toggle_off_tile_1.png" should not be equal to image "viewer_camera_audio_toggle_on_tile_2.png"

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_audio_toggle_on_3.png"
        And the image "viewer_camera_audio_toggle_on_2.png" should not be equal to image "viewer_camera_audio_toggle_on_3.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_audio_toggle_on_tile_3.png"
        And the image "viewer_camera_audio_toggle_on_tile_2.png" should not be equal to image "viewer_camera_audio_toggle_on_tile_3.png"

        When the viewer turns Off the "audio of main view"
        Then the "main view" should be displayed with default values
        And the viewer clicks on the "company name"
        And wait for "5" seconds
        And take the screenshot of "main view" at path "viewer_camera_audio_toggle_off_4.png"
        And the image "viewer_camera_audio_toggle_on_3.png" should not be equal to image "viewer_camera_audio_toggle_off_4.png"
        And take the screenshot of "camera tile list item" at path "viewer_camera_audio_toggle_on_tile_4.png"
        And the image "viewer_camera_audio_toggle_on_tile_3.png" should not be equal to image "viewer_camera_audio_toggle_on_tile_4.png"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed
