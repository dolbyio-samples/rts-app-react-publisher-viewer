@publisher-viewer
@camera-streaming
Feature: Publisher Camera Streaming
    As a publisher
    I want to do live streaming for an event with camera only

    Background: Publisher camera preiew page
        Given a publisher is on the "preview" page
        And a viewer is on the "waiting-room" page
        And switch to "preview" page on "publisher" app

    Scenario: Verify the header information, settings options, camera view, stream stats and settings when streaming with camera
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "header" should be displayed with default values
        And the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "header" should be displayed with default values
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
        And the "stream list items" should not be displayed

    Scenario: Verify the publisher is redirected to preview page when streaming is stopped
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page    

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view" setting should be displayed with default values
        And the "screen view" should not be displayed
        And the "local file view" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        #And the "header" should be displayed with default values
        And the "main view" should not be displayed

    Scenario: Stream duration is not zero when stream is live
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0-1][0-9]$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And wait for "5" seconds
        And the "header" should be displayed with following values only
            | timer text | regex: ^00:00:[0-2][0-9]$ |

    Scenario: Publisher should be able to start streaming with camera Off and toggle camera during streaming
        # Publisher App
        When the publisher turns Off the "video of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | video button status     | Off    |
            | close button            | hidden |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "stream list items" should not be displayed
    
        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of camera view"
        Then the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        
        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "video of camera view"
        And the "camera view" should be displayed with following values
            | video button status     | Off     |
            | close button            | hidden  |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone Off and toggle microphone during streaming
        # Publisher App
        When the publisher turns Off the "audio of camera view"
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | audio button status | Off  |
            | close button        | hidden |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "stream list items" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        
        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns Off the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | audio button status | Off    |
            | close button        | hidden |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Publisher should be able to start streaming with microphone-camera Off and toggle microphone-camera during streaming
        # Publisher App
        And the publisher turns Off the "video of camera view"
        And the publisher turns Off the "audio of camera view"
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values only
            | video button status | Off                |
            | audio button status | Off                |
            | close button        | hidden             |
        And the "camera view video mute image" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "stream list items" should not be displayed

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher turns On the "video of camera view"
        And the publisher turns On the "audio of camera view"
        Then the "camera view" should be displayed with following values only
            | close button        | hidden             |
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        
    Scenario: Publisher should be presented with Resolution and Bitrate Setting controls when streaming with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        When the publisher clicks on the "camera view setting button"
        Then the "settings popup" should be displayed
        And the "settings title" text should be "Stream settings"
        And the number of "settings dropdowns" count should be "2"
        And the "resolution dropdown" should be displayed
        And the "resolution dropdown" should be enabled
        And the "bitrate dropdown" should be displayed
        And the "bitrate dropdown" should be enabled
        And the "resolution dropdown options" should contain "3840x2160,2560x1440,1920x1080,1280x720,854x480,640x480,640x360" options
        And the "bitrate dropdown options" should contain "Auto,2 Mbps,1 Mbps,500 kbps,250 kbps" options

        And the "source name input" should not be displayed
        And the "codec dropdown" should not be displayed
        And the "simulcast switch" should not be displayed

    Scenario: Viewer should be presented with quality Setting controls when streaming with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" setting should be displayed with default values

        When the viewer clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled

    Scenario: Verify source name is reflected correctly after modifing it when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | source name |  BuiltIn Camera |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | source name text   | BuiltIn Camera     |
            | close button       | hidden             |
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text   | BuiltIn Camera     |
        And the "stream list items" should not be displayed

    Scenario: Publisher should be able to stream with <codec> codec and simulcast off when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast | Off       |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list items" should not be displayed   

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |
        |  vp9    |
    
    Scenario: Publisher should be able to stream with <codec> codec and simulcast ON when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast | On        |
            | codec     | <codec>   |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list items" should not be displayed

        When the publisher clicks on the "main view setting button"
        Then the "settings popup" should be displayed
        And the number of "settings dropdowns" count should be "2"
        And the "quality dropdown" should be displayed
        And the "quality dropdown" should be enabled
    Examples:
        |  codec  |
        |  h264   |
        |  vp8    |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <resolution> resolution, <codec> codec and simulcast ON when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | resolution   | <resolution> |
            | bitrate      | <bitrate>    |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list items" should not be displayed

    Examples:
        | codec |  resolution | bitrate    |
        | vp8   |  1280x720   | 2 Mbps     |
        | h264  |  1280x720   | 500 kbps   |
        | vp8   |  640x480    | 1 Mbps     |

    Scenario: Publisher should be able to stream with combination of lower bitrate <bitrate> , <resolution> resolution, <codec> codec and simulcast ON when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast    | On           |
            | codec        | <codec>      |
            | resolution   | <resolution> |
            | bitrate      | <bitrate>    |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stats with quality tabs should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values
        And the "stream list items" should not be displayed

    Examples:
        | codec |  resolution | bitrate    |
        | vp8   |  1280x720   | 250 kbps   |
        | h264  |  640x480    | 250 kbps   |

    Scenario: Publisher should be able to stream with combination of <bitrate> bitrate, <resolution> resolution, <codec> codec and simulcast OFF when streaming with camera
        # Publisher App
        When the publisher configures "camera view" setting with the following values only
            | simulcast    | Off          |
            | codec        | <codec>      |
            | resolution   | <resolution> |
            | bitrate      | <bitrate>    |
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with following values only
            | resolution | Resolution  - <resolution> |
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with following values
            | Codecs:  | regex: ^video/<codec>, audio/opus$ |
        And the "main view" setting should be displayed with default values  
    Examples:
        | codec |  resolution | bitrate    |
        | vp9   |  1280x720   | 2 Mbps     |
        | vp9   |  640x480    | 1 Mbps     |
        | vp8   |  1280x720   | 500 kbps   |
        | h264  |  640x480    | 250 kbps   |

    Scenario: Publisher should be able to change the bitrate to <bitrate> when streaming is live with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate      | <bitrate>    |
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - <bitrate>       |
        And the "camera view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
    Examples:
        |  bitrate    |
        |  2 Mbps     |
        |  500 kbps   |

    Scenario: Publisher should be able to change the resolution to <resolution> when streaming is live with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | resolution    | <resolution>    |
        And the "camera view" should be displayed with following values
            | close button       | hidden             |
        And the "camera view" setting should be displayed with following values only
            | resolution    | Resolution  - <resolution>  |
            | bitrate       | Bitrate  - Auto             |
        And the "camera view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values
    Examples:
        |  resolution  |
        |  640x480     |
        |  640x360     |

    Scenario: Publisher should be able to change the bitrate multiple time when streaming is live with camera

        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate     | 2 Mbps             |
        Then the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 2 Mbps   |
        
        When the publisher configures "camera view" setting with the following values only
            | bitrate     | 500 kbps           |
        Then the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "camera view" setting should be displayed with following values only
            | bitrate    | Bitrate  - 500 kbps |
        And the "camera view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

    Scenario: Publisher settings should be preserved after the streaming is stopped when changed during streaming
        When the publisher configures "camera view" setting with the following values only
            | source name | Dummy Camera View |
            | codec       | vp8               |
            | bitrate     | 1 Mbps            |
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        When the publisher configures "camera view" setting with the following values only
            | resolution  | 640x480  |
            | bitrate     | 2 Mbps    |
        And the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page

        And the "camera view" setting should be displayed with following values only
            | resolution  | Resolution  - 640x480   |
            | bitrate     | Bitrate  - 2 Mbps       |
            | source name | Dummy Camera View       |
        And the "camera view" should be displayed with following values
            | source name text | Dummy Camera View |
            | close button     | hidden            |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view loading" should not be displayed
        #And the "header" should be displayed with default values
        And the "main view" should not be displayed

    @ignore #Bug - 326
    Scenario: Viewer should be able to select video quality <quality> when streaming is live with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        
        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |
        |  Auto     |

    Scenario: Viewer should be able to toggle video on and off during streaming
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        When the viewer turns Off the "video of main view"
        Then the "main view" should be displayed with following values
            | video button status | Off |
            | source name text    | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "video of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

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

        When the viewer turns Off the "playback of main view"
        Then the "main view" should be displayed with following values
            | playback button status | Off |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns On the "playback of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

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
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        When the viewer turns On the "audio of main view"
        Then the "main view" should be displayed with following values
            | audio button status | On |
            | source name text    | contains: fake |

        #Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

        #Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        When the viewer turns Off the "audio of main view"
        Then the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view video mute image" should not be displayed

    Scenario: Viewer should be able to make the video view into full screen
        # Publisher App
        And the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full           |
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        When the viewer clicks on the "main view full screen button"
        And the "header" should be displayed with default values
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

    @ignore #Bug - 326
    Scenario: Viewer should be able to select video quality <quality> in full screen mode when streaming is live with camera
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        
        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        
        When the viewer clicks on the "main view full screen button"
        And the "main view" should be displayed with following values
            | size              | Full           |
            | source name text  | contains: fake |

        When the viewer configures "main view" setting with the following values
            | quality      | <quality>    |
        And the "main view" should be displayed with following values
            | size              | Full           |
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with following values
            | quality      | Quality  - <quality>    |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        And the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values
    Examples:
        |  quality  |
        |  High     |
        |  Low      |

    Scenario: Pubisher should be able to start and stop the streaming using individual source start-stop button
        # Publisher App
        When the publisher clicks on the "camera view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button | hidden |
        And the "camera view" setting should be displayed with default values
        And the "camera view" stats with quality tabs should be displayed with default values

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |
        And the "main view" stats should be displayed with default values
        And the "main view" setting should be displayed with default values

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view stop button"
        Then the publisher should be navigated to "preview" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

        # Publisher App
        And switch to "preview" page on "publisher" app
        When the publisher clicks on the "camera view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

    Scenario: Pubisher should be able to start using start all go live option and stop the streaming using individual source stop button
        # Publisher App
        When the publisher clicks on the "go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "camera view stop button"
        Then the publisher should be navigated to "preview" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed

    Scenario: Pubisher should be able to start using individual source start button and stop the streaming using stop all button
        # Publisher App
        When the publisher clicks on the "camera view go live button"
        Then the publisher should be navigated to "publisher-streaming" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "waiting-room" page on "viewer" app
        Then the viewer should be navigated to "viewer-streaming" page
        And the "main view" should be displayed with following values
            | source name text  | contains: fake |

        # Publisher App
        And switch to "publisher-streaming" page on "publisher" app
        When the publisher clicks on the "stop button"
        Then the publisher should be navigated to "preview" page
        And the "camera view" should be displayed with following values
            | close button | hidden |

        # Viewer App
        And switch to "viewer-streaming" page on "viewer" app
        Then the viewer should be navigated to "waiting-room" page
        And the "main view" should not be displayed