import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import CryptoLogo from "../Assets/Animations/Logo/CryptoLogo";
import Link from "@material-ui/core/Link";
import {UserStore} from "../Stores/UserStore";
import LoginModal from "./Users/LoginModal/LoginModal";
import LoginModalForNav from "./Users/LoginModal/LoginModalForNav";
import {Logout} from "../Repositories/UserRepository";
import {Route} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function NavBar() {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const userStore = UserStore.useState();

    const handleChange = (event) => {
        setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
      Logout();
      handleClose();
    };

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <CryptoLogo/>
                    <Typography variant="h6" className={classes.title}>
                        <Link href={"/"} color={"inherit"}>Count of Money</Link>
                    </Typography>
                    {userStore.token ? (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={open}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={logout}>
                                    Logout&nbsp;
                                    <ExitToAppIcon/>
                                </MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Typography>
                            <LoginModalForNav/>
                        </Typography>
                    )}
                </Toolbar>
            </AppBar>
        </div>
    );
}
