import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'shards-react';

export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const sheet = window.document.styleSheets[0];
sheet.insertRule(`
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`, sheet.cssRules.length);

export function Loader({ height = '20px' }) {
    const div = useRef();
    const [width, setWidth] = useState(null);

    useEffect(() => {
        setWidth(div.current.offsetWidth);
    }, [div.current]);

    const margin = width && width < height ? (width - height) / 2 : 'auto';

    return (
        <div ref={div} style={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
            <div
                style={{
                    border: 'medium solid #3498db',
                    borderTop: 'medium solid #ffffff',
                    borderRadius: '50%',
                    height,
                    width: height,
                    marginLeft: margin,
                    marginRight: margin,
                    animation: 'spin 1.2s linear infinite',
                }}
            />
        </div>
    )
}

export default function AnimatedButton({
    onClick,
    style,
    children,
    idle = children,
    active,
    success = idle,
    failure = 'Failure',
    complete = 'Success',
    onComplete = () => { },
    ...rest
}) {
    const [state, setState] = useState('idle');
    const [inner, setInner] = useState(idle);
    const [height, setHeight] = useState(null);
    const [width, setWidth] = useState(null);
    const button = useRef();

    const runOnClick = async () => {
        setState('active');
        try {
            const result = await onClick();
            setState('complete');
            onComplete(result);
        } catch (e) {
            console.log(e);
            setState('failure');
        }
    };

    useEffect(() => {
        if (state === 'idle') setInner(idle);
        if (state === 'active') setInner(active || <Loader height={.6 * height} />);
        if (state === 'complete') setInner(complete);
        if (state === 'success') setInner(success);
        if (state === 'failure') setInner(failure);
    }, [state]);

    useEffect(() => {
        if (state === 'idle') {
            setHeight(button.current.offsetHeight);
            setWidth(button.current.offsetWidth);
        }
    }, [button.current]);

    return (
        <Button
            innerRef={button}
            style={typeof inner === 'string' ? style : { height, width, ...style }}
            onClick={runOnClick}
            disabled={state !== 'idle'}
            {...rest}
        >
            {inner}
        </Button>
    );
}