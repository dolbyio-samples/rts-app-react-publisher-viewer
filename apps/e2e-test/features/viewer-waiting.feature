@viewer
Feature: Viewer Waiting Room
    As a viewer
    I should be in waiting room when the streaming is not started

    Scenario: Viewer should be in Waiting Room without a publisher
        Given a viewer is on the "waiting-room" page
        Then the "streaming status dot" should not be displayed
        And the "multi source label" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Stream is not live"
        And the "page description" text should be "Please wait for livestream to begin."

        And the "add source button" should not be displayed
        And the "invite button" should not be displayed
        And the "setting button" should not be displayed
        And the "stream info button" should not be displayed
        And the "viewers count" should not be displayed
        And the "video view" should not be displayed
        And the "screen view" should not be displayed

    Scenario: Viewer should be in the Waiting Room when the streaming is not started
        Given  a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        Then the "streaming status dot" should not be displayed
        And the "multi source label" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Stream is not live"
        And the "page description" text should be "Please wait for livestream to begin."

        And the "add source button" should not be displayed
        And the "invite button" should not be displayed
        And the "setting button" should not be displayed
        And the "stream info button" should not be displayed
        And the "viewers count" should not be displayed
        And the "video view" should not be displayed
        And the "screen view" should not be displayed        

    Scenario: Viewer should in the Waiting Room when the streaming is not started with screen sharing
        Given a viewer is on the "waiting-room" page
        And a publisher is on the "preview" page
        When the publisher clicks on the "add source button"
        And the publisher clicks on the "share screen button"
        And the "video view" should be displayed
        Then the "screen view" should be displayed
        
        When the viewer switch to "waiting-room" page
        And the "streaming status dot" should not be displayed
        And the "multi source label" should not be displayed
        And the "company name" text should be "Company name"
        And the "timer" text should be "00:00:00"
        And the "page header" text should be "Stream is not live"
        And the "page description" text should be "Please wait for livestream to begin."

        And the "add source button" should not be displayed
        And the "invite button" should not be displayed
        And the "setting button" should not be displayed
        And the "stream info button" should not be displayed
        And the "viewers count" should not be displayed
        And the "video view" should not be displayed
        And the "screen view" should not be displayed  