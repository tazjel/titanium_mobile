/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

package org.appcelerator.titanium.module.fs;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.lang.ref.SoftReference;

import org.appcelerator.titanium.TitaniumModuleManager;
import org.appcelerator.titanium.api.ITitaniumFile;
import org.appcelerator.titanium.config.TitaniumConfig;
import org.appcelerator.titanium.module.api.TitaniumMemoryBlob;
import org.appcelerator.titanium.util.Log;

import android.content.Context;

public class TitaniumResourceFile extends TitaniumBaseFile
{
	private static final String LCAT = "TiResourceFile";
	@SuppressWarnings("unused")
	private static final boolean DBG = TitaniumConfig.LOGD;

	private final SoftReference<Context> softContext;
	private final String path;

	public TitaniumResourceFile(TitaniumModuleManager tmm, String path)
	{
		super(tmm, TYPE_RESOURCE);
		this.softContext = new SoftReference<Context>(tmm.getAppContext());
		this.path = path;
	}

	@Override
	public ITitaniumFile resolve()
	{
		return this;
	}

	@Override
	public InputStream getInputStream() throws IOException
	{
		InputStream in = null;

		Context context = softContext.get();
		if (context != null) {
			in = context.getAssets().open("Resources/"+path);
		}
		return in;
	}

	@Override
	public OutputStream getOutputStream() {
		return null; // read-only;
	}

	@Override
	public File getNativeFile() {
		return new File(toURL());
	}

	@Override
	public void write(String data, boolean append) throws IOException
	{
		throw new IOException("read only");
	}

	@Override
	public void open(int mode, boolean binary) throws IOException {
		if (mode == MODE_READ) {
			InputStream in = getInputStream();
			if (in != null) {
				if (binary) {
					instream = new BufferedInputStream(in);
				} else {
					inreader = new BufferedReader(new InputStreamReader(in, "utf-8"));
				}
				opened = true;
			} else {
				throw new FileNotFoundException("File does not exist: " + path);
			}
		} else {
			throw new IOException("Resource file may not be written.");
		}
	}

	@Override
	public int read() throws IOException
	{
		ByteArrayOutputStream baos = null;
		InputStream in = null;
		try
		{
			baos = new ByteArrayOutputStream();
			in = getInputStream();
			byte buffer [] = new byte[4096];
			while(true)
			{
				int count = in.read(buffer);
				if (count < 0)
				{
					break;
				}
				baos.write(buffer, 0, count);
			}
		}
		finally
		{
			if (in!=null)
			{
				in.close();
			}
		}

		int blobId = -1;
		if (baos != null) {
			TitaniumModuleManager tmm = weakTmm.get();
			if (tmm != null) {
				TitaniumMemoryBlob blob = new TitaniumMemoryBlob(baos.toByteArray());
				blobId = tmm.cacheObject(blob);
			}
		}
		return blobId;
	}

	@Override
	public String readLine() throws IOException
	{
		String result = null;

		if (!opened) {
			throw new IOException("Must open before calling readLine");
		}
		if (binary) {
			throw new IOException("File opened in binary mode, readLine not available.");
		}

		try {
			result = inreader.readLine();
		} catch (IOException e) {
			Log.e(LCAT, "Error reading a line from the file: ", e);
		}

		return result;
	}

	@Override
	public boolean exists()
	{
		boolean result = false;
		InputStream is = null;
		try {
			is = getInputStream();
			result = true;
		} catch (IOException e) {
			// Ignore
		} finally {
			if (is != null) {
				try {
					is.close();
				} catch (IOException e) {
					// Ignore
				}
			}
		}

		return result;
	}

	@Override
	public String name()
	{
		int idx = path.lastIndexOf("/");
		if (idx != -1)
		{
			return path.substring(idx);
		}
		return path;
	}

	@Override
	public String extension()
	{
		int idx = path.lastIndexOf(".");
		if (idx != -1)
		{
			return path.substring(idx+1);
		}
		return null;
	}

	@Override
	public String nativePath()
	{
		return toURL();
	}

	public String toURL() {
		return "file:///android_asset/Resources/" + path;
	}
	public double size()
	{
		return getNativeFile().length();
	}

	public String toString ()
	{
		return toURL();
	}


	// OUTSIDE OF THE API
//	String getPath()
//	{
//		return path;
//	}
}
