import React from 'react';

export default function ResourceCard({ resource }) {
    const isVideo = resource.type === 'video';
    const isGithub = resource.type === 'github';

    return (
        <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-700 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors duration-200"
        >
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-white  truncate flex-1 pr-4" title={resource.title}>
                    {resource.title}
                </h4>
                <div className="flex items-center space-x-2">
                    {isVideo && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-md">YouTube</span>}
                    {isGithub && <span className="text-xs bg-gray-600/50 text-gray-300 px-2 py-1 rounded-md">GitHub</span>}
                    {!isVideo && !isGithub && <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-md">Article</span>}
                </div>
            </div>

            <p className="text-slate-300 text-sm line-clamp-2 max-w-full">
                {resource.description || 'No description available'}
            </p>

            {(resource.author || resource.stars !== undefined) && (
                <div className="mt-3 flex items-center text-xs text-gray-500">
                    {resource.author && <span>By {resource.author}</span>}
                    {resource.stars !== undefined && <span>⭐ {resource.stars} stars</span>}
                </div>
            )}
        </a>
    );
}
