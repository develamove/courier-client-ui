import React from 'react'
import {
  AccountBox as AccountBoxIcon,
  ChromeReaderMode,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  GetApp,
  Language as LanguageIcon,
  ViewList as ViewListIcon,
  Lock as LockIcon,
  MenuOpen as MenuOpenIcon,
  SettingsApplications as SettingsIcon
} from '@material-ui/icons'

import allLocales from './locales'
// import allThemes from './themes'

const getMenuItems = (props) => {
  const {
    intl,
    updateLocale,
    locale,
    menuContext,
    // themeContext,
    a2HSContext,
    auth: authData,
  } = props

  const {
    toggleThis,
    isDesktop,
    isAuthMenuOpen,
    isMiniSwitchVisibility,
  } = menuContext
  // const { themeID, setThemeID, isRTL, toggleThisTheme } = themeContext

  const { auth, setAuth } = authData
  const { isAppInstallable, isAppInstalled, deferredPrompt } = a2HSContext

  const localeItems = allLocales.map((l) => {
    return {
      value: undefined,
      visible: true,
      primaryText: intl.formatMessage({ id: l.locale }),
      onClick: () => {
        updateLocale(l.locale)
      },
      leftIcon: <LanguageIcon />,
    }
  })

  const isAuthorised = auth.isAuthenticated

  // const themeItems = allThemes.map((t) => {
  //   return {
  //     value: undefined,
  //     visible: true,
  //     primaryText: intl.formatMessage({ id: t.id }),
  //     onClick: () => {
  //       setThemeID(t.id)
  //     },
  //     leftIcon: <StyleIcon style={{ color: t.color }} />,
  //   }
  // })

  if (isAuthMenuOpen || !isAuthorised) {
    return [
      {
        value: '/my_account',
        primaryText: intl.formatMessage({
          id: 'my_account',
          defaultMessage: 'My Account',
        }),
        leftIcon: <AccountBoxIcon />,
      },
      {
        value: '/signin',
        onClick: isAuthorised
          ? () => {
              setAuth({ isAuthenticated: false })
            }
          : () => {},
        visible: true,
        primaryText: isAuthorised
          ? intl.formatMessage({ id: 'sign_out' })
          : intl.formatMessage({ id: 'sign_in' }),
        leftIcon: isAuthorised ? <ExitToAppIcon /> : <LockIcon />,
      },
    ]
  }
  return [
    {
      value: '/home',
      visible: isAuthorised,
      primaryText: 'New Booking',
      leftIcon: <DashboardIcon />,
    },
    {
      value: '/transaction',
      visible: isAuthorised,
      primaryText: intl.formatMessage({ id: 'transaction' }),
      leftIcon: <ViewListIcon />,
    },
    {
      primaryText: intl.formatMessage({ id: 'settings' }),
      primaryTogglesNestedList: true,
      leftIcon: <SettingsIcon />,
      nestedItems: [
        {
          primaryText: intl.formatMessage({ id: 'language' }),
          secondaryText: intl.formatMessage({ id: locale }),
          primaryTogglesNestedList: true,
          leftIcon: <LanguageIcon />,
          nestedItems: localeItems,
        },
        {
          visible: isDesktop ? true : false,
          onClick: () => {
            toggleThis('isMiniSwitchVisibility')
          },
          primaryText: intl.formatMessage({
            id: 'menu_mini_mode',
          }),
          leftIcon: isMiniSwitchVisibility ? (
            <MenuOpenIcon />
          ) : (
            <ChromeReaderMode />
          ),
        },
      ],
    },
    {
      value: null,
      visible: isAppInstallable && !isAppInstalled,
      onClick: () => {
        deferredPrompt.prompt()
      },
      primaryText: intl.formatMessage({
        id: 'install',
        defaultMessage: 'Install',
      }),
      leftIcon: <GetApp />,
    },
  ]
}
export default getMenuItems
