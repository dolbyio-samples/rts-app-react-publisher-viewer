@viewer
Feature: Viewer Waiting Room
    As a viewer
    I should be in waiting room when the streaming is not started

    Scenario: Viewer should be presented with Waiting Room without a publisher
        Given a viewer is on the "waiting-room" page
        # Then the "header" should be displayed with default values
        And the "footer" should be displayed with default values
        And the "go live button" should not be displayed
        And the "invite button" should not be displayed
        And the "main view" should not be displayed
        And the "camera view" should not be displayed
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

    Scenario: Viewer should be in the Waiting Room when the streaming is not started
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        # Then the "header" should be displayed with default values
        And the "footer" should be displayed with default values
        And the "go live button" should not be displayed
        And the "invite button" should not be displayed
        And the "main view" should not be displayed
        And the "camera view" should not be displayed
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed