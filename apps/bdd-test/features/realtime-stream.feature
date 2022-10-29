@publisher
@realtimestream
Feature: Publisher Real Time Stream Feature
    As a publisher
    I want to do real time streaming for an event

    @regression
    @smoke
    Scenario: Publisher should be able to do real time streaming for an event
        Given a publisher is on the setup page
        When the publisher starts live event
        Then the publisher should be on live stream page
        And the publisher video should be on shown in video frame

    @smoke
    @regression
    Scenario: Publisher should be able to stop real time streaming for an event
        Given a publisher is on the setup page
        When the publisher starts live event
        Then the publisher should be on live stream page
        When the publisher stop the live event
        Then the publisher should be redirected to setup page

    @regression
    Scenario: Publisher should be able to copy the viewer link before starting an event
        Given a publisher is on the setup page
        When the publisher copy the viewer link
        Then the copy link button text should be changed to 'Copied!'
        #And the viewer link should be correct
        And the copy link button text should be changed to 'Copy link'

    @regression
    Scenario: Publisher should be able to copy the viewer link after starting an event
        Given a publisher is on the setup page
        When the publisher starts live event
        Then the publisher should be on live stream page
        When the publisher copy the viewer link
        Then the copy link button text should be changed to 'Copied!'
        #And the viewer link should be correct
        And the copy link button text should be changed to 'Copy link'