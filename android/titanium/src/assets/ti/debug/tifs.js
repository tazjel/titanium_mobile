/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

Ti.fileSystemProxy = window.TitaniumFilesystem;

// we have to wrap the returned file object from Filesystem
// since he has optional parameters on some of his methods
// and the JNI bridge requires exact parameters or it will no-op
TitaniumFile = function(f) //Note: Not implemented on iPhone yet
{
	this.proxy = f;
};
/**
 * @tiapi(method = true,name=Filesystem.File.isFile,since=0.4) Checks whether a file object references a file
 * @tiresult[boolean] true if the File object references a file; otherwise, false.
 *
 */
TitaniumFile.prototype.isFile = function()
{
	return Ti.checked(this.proxy.call("isFile"));
};
/**
 * @tiapi(method = true,name=Filesystem.File.isDirectory,since=0.4) Checks whether a file object references a directory
 * @tiresult[boolean] true if the File object references a directory; otherwise, false.
 *
 */TitaniumFile.prototype.isDirectory = function()
{
	return Ti.checked(this.proxy.call("isDirectory"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.isHidden,since=0.4) Checks whether a file or directory is hidden
 * @tiresult[boolean] true if the file or directory is hidden, false if otherwise
 */
TitaniumFile.prototype.isHidden = function()
{
	return Ti.checked(this.proxy.call("isHidden"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.isSymbolicLink,since=0.4) Checks whether the File object references a symbolic link
 * @tiresult[boolean] true if the File object references a symbolic link, false if otherwise
 */
TitaniumFile.prototype.isSymbolicLink = function()
{
	return Ti.checked(this.proxy.call("isSymbolicLink"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.isExecutable,since=0.4) Checks whether a file is an executable file
 * @tiresult[boolean] true if the file is an executable file, false if otherwise
 */
TitaniumFile.prototype.isExecutable = function()
{
	return Ti.checked(this.proxy.call("isExecutable"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.isReadonly,since=0.4) Checks whether a file or directory is read-only
 * @tiresult[boolean] true if the file or directory is read-only, false if otherwise
 */
TitaniumFile.prototype.isReadonly = function()
{
	return Ti.checked(this.proxy.call("isReadonly"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.isWritable,since=0.4) Checks whether a file or directory is writeable
 * @tiresult[boolean] true if the file or directory is writeable, false if otherwise
 */
TitaniumFile.prototype.isWriteable = function()
{
	return Ti.checked(this.proxy.call("isWriteable"));
};
/**
 * @tiapi(method=True,name=Filesystem.File.resolve,since=0.4) Resolves a File object to a file path
 * @tiarg[string,path] path to resolve
 * @tiresult[File] a file object referencing a path. (Not implemented in Android, beta)
 */
TitaniumFile.prototype.resolve = function()
{
	return Ti.checked(this.proxy.call("resolve"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.read,since=0.4) Returns one line (separated by line ending) from a file
 * @tiresult[string] a string of data from the file
 */
TitaniumFile.prototype.read = function()
{
	var key = Ti.checked(this.proxy.call("read"));
	return (key != -1) ? new TitaniumMemoryBlob(key) : null;
};
/**
 * @tiapi (method=True,name=Filesystem.File.write,since=0.4) Writes data to the file
 * @tiarg [string, data] data to write to file
 * @tiarg [boolean, append] true if write should append to file.
 */
TitaniumFile.prototype.write = function(data,append)
{
	append = typeof(append)=='undefined' ? false : append;
	var p = this.proxy;

	if(data instanceof TitaniumMemoryBlob) {
		Ti.API.debug("Write As Blob");
		p.pushInteger(data.getKey());
		p.pushBoolean(append);
		Ti.checked(p.call("write"));
	} else if (!Ti.isUndefined(data.blob) && data.blob) {
		Ti.API.debug("Write As Blob File: " + String(data));
		p.pushString(data.obj.toURL());
		p.pushBoolean(append);
		Ti.checked(p.call("writeFromUrl"));
	} else {
		Ti.API.debug("Write As String");
		p.pushString(data);
		p.pushBoolean(append);
		return Ti.checked(p.call("write"));
	}
};
/**
 * @tiapi(method=true,name=Filesystem.File.readline,since=0.4) Returns one line (separated by line ending) from a file
 * @tiresult[string] A string of data from the file
 */
TitaniumFile.prototype.readLine = function()
{
	return Ti.checked(this.proxy.call("readLine"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.copy,since=0.4) Copies a file to a specified location
 * @tiarg[string,destination] destination to copy to
 * @tiresult[boolean] true if the file was successfully copied; otherwise false.
 */
TitaniumFile.prototype.copy = function(destination)
{
	var p = this.proxy;
	if (!Ti.isUndefined(destination.url)) {
		p.pushString(destination.url);
	} else {
		p.pushString(destination);
	}
	return Ti.checked(p.call("copy"));
};
/**
 * @tiapi(method=True,name=Filesystem.File.move,since=0.4) Moves a file to a specified location
 * @tiarg[string,destination]destination to move to.
 * @tiresult[boolean] true if the file was successfully moved; otherwise, false.
 */
TitaniumFile.prototype.move = function(destination)
{
	var p = this.proxy;
	if (!Ti.isUndefined(destination.url)) {
		p.pushString(destination.url);
	} else {
		p.pushString(destination);
	}
	return Ti.checked(p.call("move"));
};
/**
 * @tiapi(method=True,name=Filesystem.File.rename,since=0.4) Renames a file
 * @tiarg[string,destination] new name
 * @tiresult[boolean] true if the file was successfully renamed; otherwise, false.
 */
TitaniumFile.prototype.rename = function(destination)
{
	var p = this.proxy;
	p.pushString(destination);
	return Ti.checked(p.call("rename"));
};
/**
 * @tiapi(method=True,name=Filesystem.File.createDirectory,since=0.4) Creates a new directory
 * @tiresuls[boolean] true if the directory was successfully created; otherwise, false.
 */
TitaniumFile.prototype.createDirectory = function(recursive)
{
	recursive = typeof(recursive)=='undefined' ? false : recursive;
	var p = this.proxy;
	p.pushBoolean(recursive);
	return Ti.checked(p.call("createDirectory"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.deleteDirectory,since=0.4) Deletes a directory
 * @tiresult[boolean] true if the file was successfully deleted; otherwise, false.
 */
TitaniumFile.prototype.deleteDirectory = function(recursive)
{
	recursive = typeof(recursive)=='undefined' ? false : recursive;
	var p = this.proxy;
	p.pushBoolean(recursive);
	return Ti.checked(p.call("deleteDirectory"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.deleteFile,since=0.4) Deletes a file
 * @tiresult[boolean] true if the file was successfully deleted; otherwise, false
 */
TitaniumFile.prototype.deleteFile = function()
{
	return Ti.checked(this.proxy.call("deleteFile"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.getDirectoryListing,since=0.4) Returns a list containing the names of items in a directory.
 * @tiresult[list] a list of File items inside the directory. (Not implemented in Android beta)
 */
TitaniumFile.prototype.getDirectoryListing = function()
{
	return Ti.checked(this.proxy.call("getDirectoryListing"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.getParent,since=0.4) Returns the parent directory of a file or directory
 * @tiresult[File] the parent directory
 */
TitaniumFile.prototype.getParent = function()
{
	return Ti.checked(this.proxy.call("getParent"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.exists,since=0.4) Checks whether a file or directory exists in the users system
 * @tiresult[boolean] true if the file or directory exists; otherwise false.
 */
TitaniumFile.prototype.exists = function()
{
	return Ti.checked(this.proxy.call("exists"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.createTimestamp,since=0.4) Returns the created timestamp of a file or directory
 * @tiresult[double] the creation time of the file or directory.
 */
TitaniumFile.prototype.createTimestamp = function()
{
	return Ti.checked(this.proxy.call("createTimestamp"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.modificationTimestamp,since=0.4) Returns the last modified timestamp of a file or directory
 * @tiresult[double] the modification time of the file or directory.
 */
TitaniumFile.prototype.modificationTimestamp = function()
{
	return Ti.checked(this.proxy.call("modificationTimestamp"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.name,since=0.4) Returns the name of a file or directory
 * @tiresult[string] the name of the file or directory
 */
TitaniumFile.prototype.name = function()
{
	return Ti.checked(this.proxy.call("name"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.extension,since=0.4) Returns the extension of a file
 * @tiresult[string] extension of the file
 */
TitaniumFile.prototype.extension = function()
{
	return Ti.checked(this.proxy.call("extension"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.size,since=0.4) Returns the size of the file in bytes
 * @tiresult[double] the size of a file or directory in bytes
 */
TitaniumFile.prototype.size = function()
{
	return Ti.checked(this.proxy.call("size"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.nativePath,since=0.4) Returns the full native path of a file or directory
 * @tiresult[string] full native path of the file or directory
 */
TitaniumFile.prototype.nativePath = function()
{
	return transformObjectValueAsString(Ti.checked(this.proxy.call("nativePath")),null);
};
/**
 * @tiapi(method=true,name=Filesystem.File.spaceAvailable,since=0.4) Returns the space available on the filesystem
 * @tiresult[double] the space available on the filesystem (Not implemented in Android beta)
 */
TitaniumFile.prototype.spaceAvailable = function()
{
	return Ti.checked(this.proxy.call("spaceAvailable"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.setExecutable,since=0.4) Makes the file or directory executable
 * @tiresult[boolean] returns true if the operation was successful; otherwise, false
 */
TitaniumFile.prototype.setExecutable = function()
{
	return Ti.checked(this.proxy.call("setExecutable"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.setReadonly,since=0.4) Makes the file or directory readonly
 * @tiresult[boolean] returns true if the operation was successful; otherwise, false
 */
TitaniumFile.prototype.setReadonly = function()
{
	return Ti.checked(this.proxy.call("setReadonly"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.setWriteable,since=0.4) Makes the file or directory writeable
 * @tiresult[boolean] returns true if the operation was successful; otherwise, false
 */
TitaniumFile.prototype.setWriteable = function()
{
	return Ti.checked(this.proxy.call("setWriteable"));
};
/**
 * @tiapi(method=true,name=Filesystem.File.toString,since=0.4) Get the string representation
 * @tiresult[string] returns string representation of the file or directory
 */
TitaniumFile.prototype.toStringa = function()
{
	return String(Ti.checked(this.proxy.call("toString")));
};

TitaniumFile.prototype.__defineGetter__("path", function(){
	return this.nativePath();
});

/**
 * @tiapi(method=true,name=Filesystem.File.toURL,since=0.7) Returns the url to a file or directory
 * @tiresult[string] full url of the file or directory
 */
TitaniumFile.prototype.toURL = function()
{
	return transformObjectValueAsString(Ti.checked(this.proxy.call("toURL")),null);
};

TitaniumFile.prototype.__defineGetter__("url", function() {
	return this.toURL();
});

TitaniumFile.createBlob = function(native) {
	var f = new TitaniumFile(native);
	function TitaniumBlob(f) {this.obj = f; this.blob = true;}
	TitaniumBlob.prototype = f;
	var b = new TitaniumBlob(f);

	return b;
};

//TODO Doc
Filestream = function(proxy) {
	this.proxy = proxy;
};

// close, isOpen, open, read, readLine, ready, write, writeLine

Filestream.prototype.close = function() {
	Ti.checked(this.proxy.call("close"));
};

Filestream.prototype.isOpen = function() {
	return Ti.checked(this.proxy.call("isOpen"));
};

Filestream.prototype.open = function(mode,binary) {
	var p = this.proxy;
	p.pushInteger(mode);
	p.pushBoolean(binary);
	Ti.checked(p.call("open"));
};

Filestream.prototype.read = function() {
	return Ti.checked(this.proxy.call("read"));
};

Filestream.prototype.readLine = function() {
	return Ti.checked(this.proxy.call("readLine"));
};

Filestream.prototype.write = function(value, append) {
	var p = this.proxy;
	if (Ti.isUndefined(append)) {
		append = false;
	}
	if(value instanceof TitaniumMemoryBlob) {
		Ti.API.debug("Write As Blob");
		p.pushInteger(value.getKey());
		p.pushBoolean(append);
		Ti.checked(p.call("write"));
	} else {
		Ti.API.debug("Write As String");
		p.pushString(value);
		p.pushBoolean(append);
		Ti.checked(p.call("write"));
	}
};

Filestream.prototype.writeLine = function(value) {
	var p = this.proxy;
	p.pushString(value);
	Ti.checked(this.proxy.call("writeLine"));
};

/**
 * @tiapi(method=true,name=Filesystem.Filestream.toURL,since=0.7) Returns the url to a file or directory
 * @tiresult[string] full url of the file or directory
 */
Filestream.prototype.toURL = function()
{
	return transformObjectValueAsString(Ti.checked(this.proxy.call("toURL")),null);
};

Filestream.prototype.__defineGetter__("url", function() {
	return this.toURL();
});

Ti.Filesystem = {
	/**
	 * @tiapi(method=true,name=Filesystem.createTempFile, since=0.4) Creates a temporary file
	 * @tiresult[File] a File object referencing a temporary file.
	 */
	createTempFile : function() {
		return new TitaniumFile(Ti.fileSystemProxy.createTempFile());
	},
	/**
	 * @tiapi(method=true,name=Filesystem.createTempDirectory, since=0.4) Creates a temporary directory
	 * @tiresult[File] a File object referencing a temporary directory.
	 */
	createTempDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.createTempDirectory());
	},
	pathSegment : function(p) {
		if ('string' == Ti.typeOf(p)) {
			return p;
		} else if (!Ti.isUndefined(p.url)) {
			return p.url;
		} else {
			return ".";
		}
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getFile,since=0.4) Returns a file path, optionally joining multiple arguments together in an OS specific way
	 * @tiarg[string,arguments] one or more path segments to join.
	 * @tiresult[File] a File reference the file
	 */
	getFile : function() {
		var parts = [];
		for(i=0; i < arguments.length; i++) {
			parts.push(this.pathSegment(arguments[i]));
		}
		return new TitaniumFile(Ti.fileSystemProxy.getFile(parts));
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getFileStream,since=0.4) Returns a file stream, optionally joining multiple arguments together in an OS specific way
	 * @tiarg[string,arguments] one or more path segments to join.
	 * @tiresult[FileStream] a FileStream reference the file
	 */
	getFileStream : function() {
		var parts = [];

		for(i=0; i < arguments.length; i++) {
			parts.push(this.pathSegment(arguments[i]));
		}
		return new Filestream(Ti.fileSystemProxy.getFileStream(parts));
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getApplicationDirectory,since=0.4) Returns file object pointing to the applications installation directory
	 * @tiresult[File] a file object pointing to the application's directory.
	 */
	getApplicationDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.getApplicationDirectory());
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getApplicationDataDirectory,since=0.4) Returns a file object pointing to the application's on device data directory.
	 * @tiresult[File] the file object to the application data directory.
	 */
	getApplicationDataDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.getApplicationDataDirectory(true));
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getApplicationMassDataDirectory,since=0.7.2) Returns a file object pointing to the application's off device data directory.
	 * @tiresult[File] the file object to the application mass data directory.
	 */
	getApplicationMassDataDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.getApplicationDataDirectory(false));
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getResourcesDirectory,since=0.4) Returns a file object pointing to the application's Resources.
	 * @tiresult[File] the file object to the application Resources directory.
	 */
	getResourcesDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.getResourcesDirectory());
	},
	getUserDirectory : function() {
		return new TitaniumFile(Ti.fileSystemProxy.getUserDirectory());
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getLineEnding,since=0.4) Returns the line ending for this system.
	 * @tiresult[string] the end of line character(s).
	 */
	getLineEnding : function() {
		return "\n";
	},
	/**
	 * @tiapi(method=true,name=Filesystem.getSeparator,since=0.4) Returns the PATH separator for this system.
	 * @tiresult[string] the PATH separator.
	 */
	getSeparator : function() {
		return ";";
	},
	getRootDirectories : function() {
		var results = Ti.fileSystemProxy.getRootDirectories();
		if (results)
		{
			var files = [];
			for (var c=0;c<results.length;c++)
			{
				files[c].push(new TitaniumFile(results[c]));
			}
			return files;
		}
		return [];
	},
	asyncCopy : function() {
		return Ti.fileSystemProxy.asyncCopy(arguments);
	},

	// mobile specific APIS
	/**
	 * @tiapi(method=true,name=Filesystem.isExternalStoragePresent,since=0.4) Check to see if external media storage exists
	 * @tiresult[boolean] true if external storage is present; otherwise, false.
	 */
	isExternalStoragePresent: function() {
		return Ti.fileSystemProxy.isExternalStoragePresent();
	},

	/**
	 * @tiapi(property=true,name=Filesystem.MODE_READ,since=0.7) Flag for opening in read mode.
	 */
	MODE_READ : 0,
	/**
	 * @tiapi(property=true,name=Filesystem.MODE_WRITE,since=0.7) Flag for opening in write mode.
	 */
	MODE_WRITE : 1,
	/**
	 * @tiapi(property=true,name=Filesystem.MODE_APPEND,since=0.7) Flag for opening in append mode.
	 */
	MODE_APPEND : 2
};

Filestream.prototype.MODE_READ = Ti.Filesystem.MODE_READ;
Filestream.prototype.MODE_WRITE = Ti.Filesystem.MODE_WRITE;
Filestream.prototype.MODE_APPEND = Ti.Filesystem.MODE_APPEND;
