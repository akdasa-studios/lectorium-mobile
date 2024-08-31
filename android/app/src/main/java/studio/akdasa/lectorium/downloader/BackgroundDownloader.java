package studio.akdasa.lectorium.downloader;

import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

@CapacitorPlugin(name="BackgroundDownloader")
public class BackgroundDownloader extends Plugin {
    private BroadcastReceiver downloadReceiver;
    private PluginCall onDownloadCompleteCallback;

    @Override
    public void load() {
        super.load();
        registerDownloadReceiver();
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void onDownloadComplete(PluginCall call) {
        call.setKeepAlive(true);
        getBridge().saveCall(call);
        onDownloadCompleteCallback = call;
    }

    @PluginMethod
    public void downloadFile(PluginCall call) {
        String url = call.getString("url");
        String fileName = call.getString("fileName");
        String title = call.getString("title");

        if (url == null || fileName == null) {
            call.reject("URL and fileName are required");
            return;
        }

        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setTitle(title);

        File directory = getContext().getExternalFilesDir(".");
        Uri localUrl = Uri.fromFile(new File(directory, fileName));
        request.setDestinationUri(localUrl);

        DownloadManager downloadManager = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
        long downloadId = downloadManager.enqueue(request);

        JSObject ret = new JSObject();
        ret.put("downloadId", downloadId);
        ret.put("localUrl", localUrl.toString());
        call.resolve(ret);
    }

    private void registerDownloadReceiver() {
        downloadReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                long downloadId = intent.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1);
                if (downloadId == -1) { return; }

                DownloadManager downloadManager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
                Cursor cursor = downloadManager.query(new DownloadManager.Query().setFilterById(downloadId));

                if (cursor.moveToFirst()) {
                    int columnStatus = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS);
                    int columnLocalUri = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI);
                    int columnFileSize = cursor.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);

                    int status = cursor.getInt(columnStatus);
                    if (status == DownloadManager.STATUS_SUCCESSFUL) {
                        JSObject result = new JSObject();
                        result.put("downloadId", downloadId);
                        result.put("fileUri", cursor.getString(columnLocalUri));
                        result.put("fileSize", cursor.getString(columnFileSize));
                        onDownloadCompleteCallback.resolve(result);
                    } else if (status == DownloadManager.STATUS_FAILED) {
                        JSObject result = new JSObject();
                        result.put("downloadId", downloadId);
                        onDownloadCompleteCallback.resolve(result);
                    }
                }
                cursor.close();
            }
        };

        IntentFilter filter = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        getContext().registerReceiver(downloadReceiver, filter, Context.RECEIVER_EXPORTED);
    }

    @Override
    protected void handleOnDestroy() {
        getContext().unregisterReceiver(downloadReceiver);
        super.handleOnDestroy();
    }
}