@publisher
Feature: Publisher streaming with camera only
    As a publisher
    I want to do live streaming for an event with camera only

    Scenario: Verify the header information, settings options, stream stats when stream is live
        Given a publisher is on the "preview" page
        When the publisher clicks on the "go live button"
        
        Then the publisher should be navigated to "stream" page
        And the "streaming header" should be displayed with default values
        And the "camera view" should be displayed with following values
            | stream info button | displayed\|enabled |
        And the "camera view" setting should be displayed with only values
            | resolution | Resolution  - 3840x2160 |
            | bitrate    | Bitrate  - Auto         |
        And the "camera view" stream stats should be displayed with default values