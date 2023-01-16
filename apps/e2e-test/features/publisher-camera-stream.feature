@publisher
Feature: Publisher Camera Streaming
    As a publisher
    I want to do live streaming for an event with Camera

    @only
    Scenario: Publisher should be presented with different streaming control buttons when stream is live
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "stream" page
        
        And the "stop button" should be displayed
        And the "stop button" should be enabled
        And the "stop button" text should be "STOP"

        And the "add source button" should be displayed
        And the "add source button" should be enabled
        And the "add source button" text should be "Add Source"

        And the "invite button" should be displayed
        And the "invite button" should be enabled
        And the "invite button" text should be "Invite viewers"

        And the "streaming header" should be displayed with default values
        And the "camera view" setting should be displayed with only values
            | resolution | Resolution  - 3840x2160 |
            | bitrate    | Bitrate  - Auto         |
        # And the "camera view" stream stats with simulcast "On" should be displayed with default values