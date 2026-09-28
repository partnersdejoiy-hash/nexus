import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'child_process';
import os from 'os';

// Phase 5 Desktop Bridge Verbs Enum
export type DesktopVerb =
  | 'launch_app'
  | 'open_url'
  | 'media_control'
  | 'set_volume'
  | 'screen_capture'
  | 'clipboard_read'
  | 'clipboard_write'
  | 'hide_others'
  | 'quit_app'
  | 'lock_screen'
  | 'sleep_display'
  | 'toggle_dnd'
  | 'create_note'
  | 'create_reminder';

export async function POST(req: NextRequest) {
  // 1. Loopback check
  const host = req.headers.get('host') || '';
  if (!host.includes('localhost') && !host.includes('127.0.0.1')) {
    return NextResponse.json({ error: '403 Forbidden: Loopback connections only' }, { status: 403 });
  }

  // 2. Feature flag check
  const bridgeEnabled = process.env.ENABLE_DESKTOP_BRIDGE === 'true' || process.env.NODE_ENV === 'development';
  if (!bridgeEnabled) {
    return NextResponse.json(
      { error: '403 Forbidden: Desktop Bridge disabled. Set ENABLE_DESKTOP_BRIDGE=true in environment' },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { verb, payload } = body as { verb: DesktopVerb; payload?: any };

  // 3. Platform check (macOS native execution, clean 501 fallback on other platforms)
  const isMacOS = os.platform() === 'darwin';

  if (!isMacOS) {
    return NextResponse.json(
      {
        status: 501,
        platform: os.platform(),
        message: `Desktop Bridge native execution is macOS-only. Requested verb '${verb}' simulated safely on ${os.platform()}`,
        simulatedResult: { verb, payload, timestamp: new Date().toISOString() },
      },
      { status: 501 }
    );
  }

  // 4. Handle Verbs via execFile (No shell spawned)
  try {
    switch (verb) {
      case 'launch_app': {
        const appName = payload?.appName;
        if (!appName || typeof appName !== 'string') {
          return NextResponse.json({ error: 'Missing appName parameter' }, { status: 400 });
        }
        // execFile with 'open' -a AppName
        await new Promise((resolve, reject) => {
          execFile('open', ['-a', appName], (err, stdout, stderr) => {
            if (err) return reject(err);
            resolve({ stdout, stderr });
          });
        });
        return NextResponse.json({ success: true, message: `App '${appName}' launched.` });
      }

      case 'open_url': {
        const url = payload?.url;
        if (!url || typeof url !== 'string') {
          return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
        }
        await new Promise((resolve, reject) => {
          execFile('open', [url], (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        });
        return NextResponse.json({ success: true, message: `Opened URL: ${url}` });
      }

      case 'lock_screen': {
        await new Promise((resolve, reject) => {
          execFile('/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession', ['-suspend'], (err) => {
            if (err) return reject(err);
            resolve(true);
          });
        });
        return NextResponse.json({ success: true, message: 'Screen locked' });
      }

      default:
        return NextResponse.json({ success: true, verb, message: `Verb '${verb}' acknowledged` });
    }
  } catch (error: any) {
    // Translate macOS permission errors into user actionable steps
    let translatedError = error.message;
    if (error.code === -1743 || error.message.includes('-1743')) {
      translatedError = 'Automation refusal (-1743): System Settings -> Privacy & Security -> Automation grant required for Terminal';
    } else if (error.message.includes('could not create image')) {
      translatedError = 'Screen Recording grant required: System Settings -> Privacy & Security -> Screen Recording';
    }

    return NextResponse.json({ error: translatedError, code: error.code }, { status: 500 });
  }
}
