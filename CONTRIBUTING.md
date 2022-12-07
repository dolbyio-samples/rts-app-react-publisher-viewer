# Contributing

While working on this repository, use this guide to understand how the development process works.

## Add a new component in libs

After the command below, your component should be in `libs/<your component name>`

```bash
yarn nx g @nxext/vite:library <your component name>
```

## Storybook

If you need storybook to support your UI component development, add your component code in `libs`, and add the story into `apps/stories`. Also don't forget to add your component path in `.storybook/main.ts`
Then, run the command below:

```bash
yarn nx storybook stories
```

The following components and hooks are currently present to simplify your workflow

### Components

- Alert
- ActionBar
- ControlBar
- DropDown
- InfoLabel
- LiveIndicator
- PopupMenu
- ShareLinkButton
- StatisticInfo
- Timer
- ToggleButton
- VideoView

### Hooks

- useMediaCapabilities
- useNotification
- usePublisher
- useViewer
