@multisource-streaming
@publisher-viewer
Feature: Publisher Multisource Streaming
    As a publisher
    I want to do live streaming for an event with Multisource

    Background: Add multi source on preview page
        Given a publisher is on the "preview" page
        And the "camera view" should be displayed
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app
        When the publisher adds "screen" source
        And the publisher adds "local" file source
        And the "screen view" should be displayed with default values
        Then the "local file view" should be displayed with default values
       
    Scenario: Publisher streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with following values
            | multi source label       |  displayed           |
            | multi source label text  |  Multisource enabled |

        And the "camera view" should be displayed with default values
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values

        And the "screen view" should be displayed with default values
        And the "screen view" setting should be displayed with default values
        And the "screen view" stats with quality tabs should be displayed with default values

        And the "local file view" should be displayed with default values
        And the "local file view" setting should be displayed with default values
        And the "local file view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed

    Scenario: Publisher streaming multiple sources with different settings
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | source name | Dummy Camera View |
            | simulcast   | Off               |
            | codec       | vp9               |
            | bitrate     | 1 Mbps            |
            | resolution  | 640x480           |
        And the publisher configures "screen view" setting with the following values only
            | source name  | Dummy Screen Share   |
            | simulcast    | On                   |
            | codec        | vp8                  |
            | bitrate      | 2 Mbps               |
        And the publisher configures "local file view" setting with the following values only
            | source name  | Dummy Local File   |
            | simulcast    | On                 |
            | codec        | h264               |
            | bitrate      | 500 kbps           |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "camera view" should be displayed with following values
            | source name text  | Dummy Camera View |
        And the "camera view" setting should be displayed with following values
            | resolution   | Resolution  - 640x480    |
            | bitrate      | Bitrate  - 1 Mbps       |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/vp9, audio/opus$ |

        And the "screen view" should be displayed with following values
            | source name text  | Dummy Screen Share |
        And the "screen view" setting should be displayed with following values
            | bitrate      | Bitrate  - 2 Mbps       |
        And the "screen view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |

        And the "local file view" should be displayed with following values
            | source name text  | Dummy Local File |
        And the "local file view" setting should be displayed with following values
            | bitrate      | Bitrate  - 500 kbps  |
        And the "local file view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "Dummy Camera View"
        Then the "main view" should be displayed with following values
            | source name text  | contains: Dummy Camera View |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp9, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list item" with locator attribute "Dummy Local File" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share" should be displayed

        When the viewer projects main stream as source name containing "Dummy Local File"
        And the "main view" should be displayed with following values
            | source name text  | contains: Dummy Local File |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "stream list item" with locator attribute "Dummy Camera View" should be displayed
        And the "stream list item" with locator attribute "Dummy Screen Share" should be displayed

        When the viewer projects main stream as source name containing "Dummy Screen Share"
        Then the "main view" should be displayed with following values
            | source name text  | contains: Dummy Screen Share |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/vp8, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list item" with locator attribute "Dummy Camera View" should be displayed
        And the "stream list item" with locator attribute "Dummy Local File" should be displayed
 
    Scenario: Publisher changes the settings when streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with following values
            | multi source label       |  displayed           |
            | multi source label text  |  Multisource enabled |

        And the "camera view" should be displayed
        And the "screen view" should be displayed
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher configures "camera view" setting with the following values only
            | resolution  | 640x480  |
            | bitrate     | 1 Mbps   |
        And the publisher configures "screen view" setting with the following values only
            | bitrate     | 500 kbps   |
        And the publisher configures "local file view" setting with the following values only
            | bitrate     | 250 kbps   |

        Then the "camera view" setting should be displayed with following values only
            | resolution  | Resolution  - 640x480   |
            | bitrate     | Bitrate  - 1 Mbps       |
        Then the "screen view" setting should be displayed with following values only
            | bitrate     | Bitrate  - 500 kbps     |
        Then the "local file view" setting should be displayed with following values only
            | bitrate     | Bitrate  - 250 kbps     |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed

    Scenario: Publisher toggles the audio, video and playback when streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "camera view" should be displayed
        And the "screen view" should be displayed
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "video of camera view"
        And the publisher turns Off the "video of screen view"
        And the publisher turns Off the "video of local file view"

        Then the "camera view" should be displayed with following values
            | video button status     | Off    |
        And the "camera view video mute image" should be displayed       
        Then the "screen view" should be displayed with following values
            | video button status     | Off    |
        And the "screen view video mute image" should be displayed 
        Then the "local file view" should be displayed with following values
            | video button status     | Off    |
        And the "local file view video mute image" should be displayed 

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"
        # TODO: Add Validation for video Off on viewer side
       
        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "audio of camera view"
        And the publisher turns Off the "playback of local file view"

        Then the "camera view" should be displayed with following values
            | video button status     | Off    |
            | audio button status     | Off    |
        And the "camera view video mute image" should be displayed       
        Then the "screen view" should be displayed with following values
            | video button status     | Off    |
        And the "screen view video mute image" should be displayed 
        Then the "local file view" should be displayed with following values
            | video button status     | Off    |
            | playback button status  | Off    |
        And the "local file view video mute image" should be displayed 

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of camera view"
        And the publisher turns On the "playback of local file view"

        Then the "camera view" should be displayed with following values
            | audio button status     | Off    |
        And the "camera view video mute image" should not be displayed       
        Then the "screen view" should be displayed with following values
            | video button status     | Off    |
        And the "screen view video mute image" should be displayed 
        Then the "local file view" should be displayed with following values
            | video button status  | Off    |
        And the "local file view video mute image" should be displayed 

    @ignore #Bug - 311
    Scenario: Viewer toogles the audio, video and playback of different sources during streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed
        And the "screen view" should be displayed
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        When the viewer turns Off the "video of main view"
        When the viewer turns On the "audio of main view"
        And the viewer turns Off the "playback of main view"
        Then the "main view" should be displayed with following values
            | source name text        | contains: fake |
            | audio button status     | On |
            | video button status     | Off |
            | playback button status  | Off |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        When the viewer turns On the "audio of main view"
        And the "main view" should be displayed with following values
            | source name text     | contains: local-file |
            | audio button status  | On                  |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        When the viewer turns Off the "video of main view"
        Then the "main view" should be displayed with following values
            | source name text     | contains: screen |
            | video button status  | Off              |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text        | contains: fake |
            | video button status     | On |
            | video button status     | Off |
            | playback button status  | Off |
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

        When the viewer clicks on the "local file tile list item"
        And the "main view" should be displayed with following values
            | source name text     | contains: local-file |
            | audio button status  | On                   |
        And the "screen share tile list item" should be displayed
        And the "camera tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text     | contains: screen |
            | video button status  | Off              |
        And the "camera tile list item" should be displayed
        And the "local file tile list item" should be displayed
        And the number of "stream list loading items" count should be "0"

    @ignore #Bug - 316
    Scenario: Publisher starts with streaming all and then stop and start different sources when streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed
        And the "screen view" should be displayed
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view stop button"
        And the "camera view" should be displayed with following values
            | stream info button   | hidden             |
            | go live button       | displayed\|enabled |
            | go live button text  | GO LIVE            |
            | stop button          | hidden             |
            | stop button text     | ignore:            |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "local file tile list item" should be displayed
        And the "camera tile list item" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view stop button"
        And the publisher clicks on the "camera view go live button"
        And the publisher adds "local" file source with file "nature-file.mp4"
        And the "camera view" should be displayed with default values
        And the "1st" "local file view" should be displayed with following values
            | stream info button   | hidden             |
            | go live button       | displayed\|enabled |
            | go live button text  | GO LIVE            |
            | stop button          | hidden             |
            | stop button text     | ignore:            |
        And the publisher hovers the mouse over the "2nd" "local file view"
        And the "2nd" "local file view" should be displayed with following values
            | source name text      | contains: nature-file.mp4 |
            | audio button          | hidden                    |
            | audio button status   | ignore:                   |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "nature-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: nature-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should not be displayed
        And the "screen share tile list item" should not be displayed
        And the "local file tile list item" should not be displayed

    Scenario: Publisher stops and start different sources when streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "camera view go live button"
        When the publisher clicks on the "screen view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with default values
        And the "screen view" should be displayed with default values
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "local file view go live button"
        When the publisher clicks on the "screen view stop button"
        And the publisher adds "local" file source with file "nature-file.mp4"

        And the "screen view" should be displayed with following values
            | stream info button   | hidden             |
            | go live button       | displayed\|enabled |
            | go live button text  | GO LIVE            |
            | stop button          | hidden             |
            | stop button text     | ignore:            |
        And the "1st" "local file view" should be displayed with default values
        And the "2nd" "local file view" should be displayed with following values
            | source name text      | contains: nature-file     |
            | audio button          | hidden                    |
            | audio button status   | ignore:                   |
            | stream info button    | hidden                    |
            | go live button        | displayed\|enabled        |
            | go live button text   | GO LIVE                   |
            | stop button           | hidden                    |
            | stop button text      | ignore:                   |       

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "local-file"
        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "screen share tile list item" should not be displayed
        And the "local file tile list item" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "screen view go live button"
        And the "camera view" should be displayed with default values
        And the "screen view" should be displayed with default values
        And the "1st" "local file view" should be displayed with default values
        And the "2nd" "local file view" should be displayed with following values
            | source name text      | contains: nature-file     |
            | audio button          | hidden                    |
            | audio button status   | ignore:                   |
            | stream info button    | hidden                    |
            | go live button        | displayed\|enabled        |
            | go live button text   | GO LIVE                   |
            | stop button           | hidden                    |
            | stop button text      | ignore:                   | 

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        Then the "main view" should be displayed with following values
            | source name text  | contains: local-file |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "camera tile list item" should be displayed
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should not be displayed

    Scenario: Publisher closes and adds different sources when streaming with multiple sources
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        And the "camera view" should be displayed
        And the "screen view" should be displayed
        And the "local file view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        # And the "header" should be displayed with default values
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view close button"
        And the "camera view" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "1"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "screen"
        Then the "main view" should be displayed with following values
            | source name text  | contains: screen |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "local file tile list item" should be displayed
        And the "camera tile list item" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher adds "camera" source
        And the "camera view" should be displayed with default values

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the number of "stream list items" count should be "2"
        And the number of "stream list loading items" count should be "0"

        When the viewer projects main stream as source name containing "fake"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "screen share tile list item" should be displayed
        And the "local file tile list item" should be displayed
        And the "camera tile list item" should not be displayed