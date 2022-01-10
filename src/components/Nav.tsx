/**
 * Things to work on:
 * 1) Categories navbar dropdown
 * 2) Wallet slide open from right-side
 * 3) Possibly add more items to account pop-up
 */

import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined'
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import TokenIcon from '@mui/icons-material/Token'
import { MARGIN_NAV_BUTTON } from '../../constants'

import Link from 'next/link'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: '1px solid lightGrey',
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '45ch',
    },
    [theme.breakpoints.up('lg')]: {
      width: '60ch',
    },
  },
}))

export default function PrimarySearchAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      sx={{ marginTop: '2.5rem' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Link href='/account'>
        <MenuItem onClick={handleMenuClose}>Account</MenuItem>
      </Link>
      <Link href='/account/created'>
        <MenuItem onClick={handleMenuClose}>Created</MenuItem>
      </Link>
      <Link href='/account/purchased'>
        <MenuItem onClick={handleMenuClose}>Purchased</MenuItem>
      </Link>
      <Link href='/account/shopping-cart'>
        <MenuItem onClick={handleMenuClose}>Cart</MenuItem>
      </Link>
      <Link href='/account/favorite'>
        <MenuItem onClick={handleMenuClose}>Favorite</MenuItem>
      </Link>
      <Link href='/account/edit'>
        <MenuItem onClick={handleMenuClose}>Edit</MenuItem>
      </Link>
      <Link href='/'>
        <MenuItem onClick={handleMenuClose}>Log Out</MenuItem>
      </Link>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        sx={{
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0px 0px 2.5px 0px grey',
          top: 0,
        }}
        position='fixed'
      >
        <Toolbar>
          <Link href='/'>
            <Button
              sx={{ color: 'inherit', textTransform: 'none' }}
              className='no-hover'
              disableRipple
            >
              <TokenIcon sx={{ marginRight: '0.1rem', fontSize: 40 }} />
              <Typography
                variant='h6'
                noWrap
                component='div'
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 600,
                }}
                className='font-chakra'
              >
                Tokenverse
              </Typography>
            </Button>
          </Link>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Button
              className='nav-button'
              sx={{
                color: 'inherit',
                textTransform: 'none',
                fontSize: 16,
              }}
            >
              Categories
            </Button>
            <Link href='/entrance'>
              <Button
                className='nav-button'
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontSize: 16,
                }}
              >
                Entrance
              </Button>
            </Link>
            <Link href='/design'>
              <Button
                className='nav-button'
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontSize: 16,
                }}
              >
                Design
              </Button>
            </Link>
            <Link href='/create'>
              <Button
                className='nav-button'
                sx={{
                  color: 'inherit',
                  textTransform: 'none',
                  fontSize: 16,
                }}
              >
                Create
              </Button>
            </Link>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Tooltip title='Categories'>
              <IconButton
                size='large'
                edge='end'
                aria-label='categories'
                aria-controls={menuId}
                aria-haspopup='true'
                color='inherit'
                disableRipple
              >
                <ListAltOutlinedIcon />
              </IconButton>
            </Tooltip>
            <Link href='/entrance'>
              <Tooltip title='Entrance'>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='categories'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                  disableRipple
                >
                  <SensorDoorOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Link href='/design'>
              <Tooltip title='Design'>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='design'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                  disableRipple
                >
                  <AddPhotoAlternateOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Link>
            <Link href='/create'>
              <Tooltip title='Create'>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='create'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                  disableRipple
                >
                  <AddBoxOutlinedIcon />
                </IconButton>
              </Tooltip>
            </Link>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Link href='/help'>
              <Tooltip title='Help'>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='help'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                  sx={{
                    marginLeft: MARGIN_NAV_BUTTON,
                    marginRight: MARGIN_NAV_BUTTON,
                  }}
                  className='nav-button'
                >
                  <HelpOutlineOutlinedIcon size='large' />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title='Wallet'>
              <IconButton
                size='large'
                edge='end'
                aria-label='wallet'
                aria-controls={menuId}
                aria-haspopup='true'
                color='inherit'
                sx={{
                  marginLeft: MARGIN_NAV_BUTTON,
                  marginRight: MARGIN_NAV_BUTTON,
                }}
                className='nav-button'
              >
                <AccountBalanceWalletOutlinedIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
              sx={{
                marginLeft: MARGIN_NAV_BUTTON,
                marginRight: MARGIN_NAV_BUTTON,
              }}
              className='nav-button'
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Link href='/help'>
              <Tooltip title='Help'>
                <IconButton
                  size='large'
                  edge='end'
                  aria-label='help'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                  sx={{
                    marginLeft: 'none',
                    marginRight: 'none',
                  }}
                  disableRipple
                >
                  <HelpOutlineOutlinedIcon size='large' />
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title='Wallet'>
              <IconButton
                size='large'
                edge='end'
                aria-label='wallet'
                aria-controls={menuId}
                aria-haspopup='true'
                color='inherit'
                sx={{
                  marginLeft: 'none',
                  marginRight: 'none',
                }}
                disableRipple
              >
                <AccountBalanceWalletOutlinedIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size='large'
              edge='end'
              aria-label='account of current user'
              aria-controls={menuId}
              aria-haspopup='true'
              onClick={handleProfileMenuOpen}
              color='inherit'
              sx={{
                marginLeft: { xs: 'none', md: MARGIN_NAV_BUTTON },
                marginRight: { xs: 'none', md: MARGIN_NAV_BUTTON },
              }}
              disableRipple
            >
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  )
}
