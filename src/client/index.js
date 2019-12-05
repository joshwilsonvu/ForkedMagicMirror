import React from 'react';
import ReactDOM from 'react-dom';
import {MagicMirror} from 'magicmirrorx';
import config from '../config/config';

// make CSS globally available
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'roboto-fontface/css/roboto-condensed/roboto-condensed-fontface.css';
import './main.css';


ReactDOM.render(<MagicMirror config={config}/>, document.getElementById('root'));
