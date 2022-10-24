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