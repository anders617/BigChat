import {
	ControlsFactory
} from '../controller/controller';
import {
	register
} from './rpc';

register('controls', ControlsFactory());