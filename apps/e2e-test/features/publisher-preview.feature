@publisher
Feature: Publisher Preview
    As a publisher
    I want to setup the stream configuration on Preview page
    So that I can stream with required configuration

    Background: Publisher preiew page
        Given a publisher is on the "preview" page

    Scenario: Publisher should be presented with header and footer containing different streaming control buttons to set configuration
        And the "footer" should be displayed with default values

    Scenario: Publisher should be presented with camera view only by default when app is loaded
        Then the "camera view" should be displayed
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

    Scenario: Publisher should be presented with multiple sources option under Add Sources
        When the publisher clicks on the "add source button"
        Then the "share screen button" should be visible
        And the "share screen button" should be enabled
        And the "add source menu" should contain "Share screen,Add cameras,Stream local file" options

    Scenario: Publisher should be able to copy the viewer link before going live for the broadcast
        When the publisher clicks on the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Link copied!"
        And the "invite button" text should be "Invite viewers"

    @local
    Scenario: Publisher should be able to get the same viewer link when copied mulitple times before going live for the broadcast
        When the publisher clicks on the "invite button"
        Then the copied clipboard text should contain "^${ViewerBaseURL}/\?streamAccountId=\w+&streamName=\w+$"
        And store the copied clipboard text in "invite_link_1" variable
        And wait for "2" seconds
        
        When the publisher clicks on the "invite button"
        Then the copied clipboard text should be equal to the stored "invite_link_1" variable

    Scenario: Publisher should be able to see the tooltip for different controls
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "go live button"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "timer"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "company name"
        Then the "tooltip" should not be displayed

        When the publisher hovers the mouse over the "invite button"
        Then the "tooltip" should be displayed
        And the "tooltip" text should be "Copy link"

        When the publisher hovers the mouse over the "add source button"
        Then the "tooltip" should not be displayed
