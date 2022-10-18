Feature: Publisher Setup Feature
    As a publisher
    I want to setup the stream configuration

    Scenario: Publisher should be able to turn off the microphone
        Given a publisher is on the setup page
        When the publisher turns off the microphone
        Then the microphone should be turned off

    Scenario: Publisher should be able to turn off the camera
        Given a publisher is on the setup page
        When the publisher turns off the camera
        Then the camera should be turned off