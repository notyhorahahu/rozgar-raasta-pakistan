import * as devalue from "devalue";
import { t as createConsoleLogger } from "./console_ClfCadOL.mjs";
import { c as level, o as recordContentEntryRender, r as VALID_INPUT_FORMATS } from "./consts_CH1N1oyO.mjs";
import { escape } from "html-escaper";
import * as z from "zod/v4";
import { C as unescapeHTML, k as generateCspDigest, n as renderScriptElement, o as renderComponent, p as renderTemplate, r as renderUniqueStylesheet, t as spreadAttributes, v as createHeadAndContent } from "./server_D5ItN1nv.mjs";
import "./server_Bx0J2xEY.mjs";
import { t as createComponent } from "./astro-component_DL7iB5yq.mjs";
import { c as isRemotePath, d as removeBase, u as prependForwardSlash } from "./path_jvl2hruy.mjs";
import { H as RenderUndefinedEntryError, J as UnknownContentCollectionError, Z as AstroError } from "./errors-data_CwqNbahj.mjs";
import { marked } from "marked";
import { t as query } from "./db_DDXrkiRw.mjs";
// node_modules/astro/dist/assets/runtime.js
function createSvgComponent({ meta, attributes, children, styles }) {
	const hasStyles = styles.length > 0;
	const Component = createComponent({
		async factory(result, props) {
			const normalizedProps = normalizeProps(attributes, props);
			if (hasStyles && result.cspDestination) for (const style of styles) {
				const hash = await generateCspDigest(style, result.cspAlgorithm);
				result._metadata.extraStyleHashes.push(hash);
			}
			return renderTemplate`<svg${spreadAttributes(normalizedProps)}>${unescapeHTML(children)}</svg>`;
		},
		propagation: hasStyles ? "self" : "none"
	});
	Object.defineProperty(Component, "toJSON", {
		value: () => meta,
		enumerable: false
	});
	return Object.assign(Component, meta);
}
/**
* Some attributes required for `image/svg+xml` are irrelevant when inlined in a `text/html` document. We can save a few bytes by dropping them.
*/
var ATTRS_TO_DROP = [
	"xmlns",
	"xmlns:xlink",
	"version"
];
var DEFAULT_ATTRS = {};
function dropAttributes(attributes) {
	for (const attr of ATTRS_TO_DROP) delete attributes[attr];
	return attributes;
}
function normalizeProps(attributes, props) {
	return dropAttributes({
		...DEFAULT_ATTRS,
		...attributes,
		...props
	});
}
// node_modules/astro/dist/content/consts.js
var CONTENT_IMAGE_FLAG = "astroContentImageFlag";
var IMAGE_IMPORT_PREFIX = "__ASTRO_IMAGE_";
// node_modules/astro/dist/assets/utils/resolveImports.js
/**
* Resolves an image src from a content file (such as markdown) to a module ID or import that can be resolved by Vite.
*
* @param imageSrc The src attribute of an image tag
* @param filePath The path to the file that contains the image relative to the site root
* @returns A module id of the image that can be resolved by Vite, or undefined if it is not a local image
*/
function imageSrcToImportId(imageSrc, filePath) {
	imageSrc = removeBase(imageSrc, IMAGE_IMPORT_PREFIX);
	if (isRemotePath(imageSrc)) return;
	const ext = imageSrc.split(".").at(-1)?.toLowerCase();
	if (!ext || !VALID_INPUT_FORMATS.includes(ext)) return;
	const params = new URLSearchParams(CONTENT_IMAGE_FLAG);
	if (filePath) params.set("importer", filePath);
	return `${imageSrc}?${params.toString()}`;
}
// node_modules/astro/dist/content/data-store-source.js
/**
* A {@link DataStoreSource} backed by an in-memory {@link ImmutableDataStore}.
* All queries resolve synchronously; the async signatures exist to satisfy the
* {@link DataStoreSource} contract.
*/
var InMemorySource = class {
	#store;
	constructor(store) {
		this.#store = store;
	}
	hasCollection(collection) {
		return this.#store.hasCollection(collection);
	}
	get(collection, key) {
		return this.#store.get(collection, key);
	}
	entries(collection) {
		return this.#store.entries(collection);
	}
	values(collection) {
		return this.#store.values(collection);
	}
	keys(collection) {
		return this.#store.keys(collection);
	}
	has(collection, key) {
		return this.#store.has(collection, key);
	}
	collections() {
		return this.#store.collections();
	}
};
// node_modules/astro/dist/content/data-store.js
/**
* Rebuilds a collection from ordered parts containing newline-delimited
* `devalue.stringify([id, entry])` records.
*/
var ChunkedCollectionParser = class {
	#entries = /* @__PURE__ */ new Map();
	#remainder = "";
	add(part) {
		const records = (this.#remainder + part).split("\n");
		this.#remainder = records.pop();
		for (const record of records) {
			const parsed = devalue.parse(record);
			if (!Array.isArray(parsed) || parsed.length !== 2 || typeof parsed[0] !== "string") throw new Error("Invalid chunked data store entry");
			this.#entries.set(parsed[0], parsed[1]);
		}
	}
	finish() {
		if (this.#remainder) throw new Error("Invalid chunked data store entry");
		return this.#entries;
	}
};
/**
* A read-only data store for content collections. This is used to retrieve data from the content layer at runtime.
* To add or modify data, use {@link MutableDataStore} instead.
*/
var ImmutableDataStore = class ImmutableDataStore {
	_collections = /* @__PURE__ */ new Map();
	constructor() {
		this._collections = /* @__PURE__ */ new Map();
	}
	get(collectionName, key) {
		return this._collections.get(collectionName)?.get(String(key));
	}
	entries(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).entries()];
	}
	values(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).values()];
	}
	keys(collectionName) {
		return [...(this._collections.get(collectionName) ?? /* @__PURE__ */ new Map()).keys()];
	}
	has(collectionName, key) {
		const collection = this._collections.get(collectionName);
		if (collection) return collection.has(String(key));
		return false;
	}
	hasCollection(collectionName) {
		return this._collections.has(collectionName);
	}
	collections() {
		return this._collections;
	}
	/**
	* Rebuilds a collections map from a chunked-store manifest whose part file
	* names have already been swapped for their contents.
	*
	* Each collection maps to a list of parts. A part is either a raw string
	* (when the store is loaded from disk) or an ESM namespace from a virtual
	* chunk import (`{ default: string }`, when emitted at runtime). Each part
	* contains independently serialized entry records. This is the inverse of
	* {@link import('./data-store-writer.js').ChunkedWriter} and stays free of
	* Node built-ins so it can run at runtime.
	*/
	static manifestToMap(manifest) {
		const collections = /* @__PURE__ */ new Map();
		for (const [collectionName, parts] of Object.entries(manifest)) {
			const parser = new ChunkedCollectionParser();
			for (const part of parts) parser.add(typeof part === "string" ? part : part.default);
			collections.set(collectionName, parser.finish());
		}
		return collections;
	}
	/**
	* Attempts to load a DataStore from the virtual module.
	* This only works in Vite.
	*/
	static async fromModule() {
		try {
			const data = await import("./_astro_data-layer-content_BrJTMHyt.mjs");
			if (data.default instanceof Map) return ImmutableDataStore.fromMap(data.default);
			if (Array.isArray(data.default)) {
				const map = devalue.unflatten(data.default);
				return ImmutableDataStore.fromMap(map);
			}
			const map = ImmutableDataStore.manifestToMap(data.default);
			return ImmutableDataStore.fromMap(map);
		} catch {}
		return new ImmutableDataStore();
	}
	static async fromMap(data) {
		const store = new ImmutableDataStore();
		store._collections = data;
		return store;
	}
};
function dataStoreSingleton() {
	let instance = void 0;
	return {
		get: async () => {
			if (!instance) instance = ImmutableDataStore.fromModule().then((store) => new InMemorySource(store));
			return instance;
		},
		set: (store) => {
			instance = new InMemorySource(store);
		}
	};
}
/** @internal */
var globalDataStore = dataStoreSingleton();
// node_modules/astro/dist/content/loaders/errors.js
function formatZodError(error) {
	return error.issues.map((issue) => `  **${issue.path.join(".")}**: ${issue.message}`);
}
var LiveCollectionError = class LiveCollectionError extends Error {
	collection;
	message;
	cause;
	constructor(collection, message, cause) {
		super(message);
		this.collection = collection;
		this.message = message;
		this.cause = cause;
		this.name = "LiveCollectionError";
		if (cause?.stack) this.stack = cause.stack;
	}
	static is(error) {
		return error instanceof LiveCollectionError;
	}
};
var LiveEntryNotFoundError = class extends LiveCollectionError {
	constructor(collection, entryFilter) {
		super(collection, `Entry ${collection} → ${typeof entryFilter === "string" ? entryFilter : JSON.stringify(entryFilter)} was not found.`);
		this.name = "LiveEntryNotFoundError";
	}
	static is(error) {
		return error?.name === "LiveEntryNotFoundError";
	}
};
var LiveCollectionValidationError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${collection} → ${entryId}** data does not match the collection schema.\n`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionValidationError";
	}
	static is(error) {
		return error?.name === "LiveCollectionValidationError";
	}
};
var LiveCollectionCacheHintError = class extends LiveCollectionError {
	constructor(collection, entryId, error) {
		super(collection, [
			`**${String(collection)}${entryId ? ` → ${String(entryId)}` : ""}** returned an invalid cache hint.\n`,
			...formatZodError(error),
			""
		].join("\n"));
		this.name = "LiveCollectionCacheHintError";
	}
	static is(error) {
		return error?.name === "LiveCollectionCacheHintError";
	}
};
// node_modules/astro/dist/content/runtime.js
var cacheHintSchema = z.object({
	tags: z.array(z.string()).optional(),
	lastModified: z.date().optional()
});
async function parseLiveEntry(entry, schema, collection) {
	try {
		const parsed = await z.safeParseAsync(schema, entry.data);
		if (!parsed.success) return { error: new LiveCollectionValidationError(collection, entry.id, parsed.error) };
		if (entry.cacheHint) {
			const cacheHint = cacheHintSchema.safeParse(entry.cacheHint);
			if (!cacheHint.success) return { error: new LiveCollectionCacheHintError(collection, entry.id, cacheHint.error) };
			entry.cacheHint = cacheHint.data;
		}
		return { entry: {
			...entry,
			data: parsed.data
		} };
	} catch (error) {
		return { error: new LiveCollectionError(collection, `Unexpected error parsing entry ${entry.id} in collection ${collection}`, error) };
	}
}
function createGetCollection({ liveCollections, logger }) {
	return async function getCollection(collection, filter) {
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveCollection() instead of getCollection().`
		});
		const hasFilter = typeof filter === "function";
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const { default: imageAssetMap } = await import("./content-assets_CLeMUEVR.mjs");
			const result = [];
			for (const rawEntry of await store.values(collection)) {
				const data = resolveEntryData(rawEntry, imageAssetMap);
				let entry = {
					...rawEntry,
					data,
					collection
				};
				if (hasFilter && !filter(entry)) continue;
				result.push(entry);
			}
			return result;
		} else {
			logger.warn("content", `The collection ${JSON.stringify(collection)} does not exist or is empty. Please check your content config file for errors.`);
			return [];
		}
	};
}
function createGetEntry({ liveCollections, logger }) {
	return async function getEntry(collectionOrLookupObject, lookup) {
		let collection, lookupId;
		if (typeof collectionOrLookupObject === "string") {
			collection = collectionOrLookupObject;
			if (!lookup) throw new AstroError({
				...UnknownContentCollectionError,
				message: "`getEntry()` requires an entry identifier as the second argument."
			});
			lookupId = lookup;
		} else {
			collection = collectionOrLookupObject.collection;
			lookupId = "id" in collectionOrLookupObject ? collectionOrLookupObject.id : collectionOrLookupObject.slug;
		}
		if (collection in liveCollections) throw new AstroError({
			...UnknownContentCollectionError,
			message: `Collection "${collection}" is a live collection. Use getLiveEntry() instead of getEntry().`
		});
		if (typeof lookupId === "object") throw new AstroError({
			...UnknownContentCollectionError,
			message: `The entry identifier must be a string. Received object.`
		});
		const store = await globalDataStore.get();
		if (await store.hasCollection(collection)) {
			const entry = await store.get(collection, lookupId);
			if (!entry) {
				logger.warn("content", `Entry ${collection} → ${lookupId} was not found.`);
				return;
			}
			const { default: imageAssetMap } = await import("./content-assets_CLeMUEVR.mjs");
			const data = resolveEntryData(entry, imageAssetMap);
			const result = {
				...entry,
				data,
				collection
			};
			warnForPropertyAccess(logger, result.data, "slug", `[content] Attempted to access deprecated property on "${collection}" entry.\nThe "slug" property is no longer automatically added to entries. Please use the "id" property instead.`);
			warnForPropertyAccess(logger, result, "render", `[content] Invalid attempt to access "render()" method on "${collection}" entry.\nTo render an entry, use "render(entry)" from "astro:content".`);
			return result;
		}
	};
}
function warnForPropertyAccess(logger, entry, prop, message) {
	if (!(prop in entry)) {
		let _value = void 0;
		Object.defineProperty(entry, prop, {
			get() {
				if (_value === void 0) logger.error("content", message);
				return _value;
			},
			set(v) {
				_value = v;
			},
			enumerable: false
		});
	}
}
function createGetLiveCollection({ liveCollections }) {
	return async function getLiveCollection(collection, filter) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveCollection() to load regular content collections.`) };
		try {
			const context = {
				filter,
				collection
			};
			const response = await liveCollections[collection].loader?.loadCollection?.(context);
			if (response && "error" in response) return { error: response.error };
			const { schema } = liveCollections[collection];
			let processedEntries = response.entries;
			if (schema) {
				const entryResults = await Promise.all(response.entries.map((entry) => parseLiveEntry(entry, schema, collection)));
				for (const result of entryResults) if (result.error) return { error: result.error };
				processedEntries = entryResults.map((result) => result.entry);
			}
			let cacheHint = response.cacheHint;
			if (cacheHint) {
				const cacheHintResult = cacheHintSchema.safeParse(cacheHint);
				if (!cacheHintResult.success) return { error: new LiveCollectionCacheHintError(collection, void 0, cacheHintResult.error) };
				cacheHint = cacheHintResult.data;
			}
			if (processedEntries.length > 0) {
				const entryTags = /* @__PURE__ */ new Set();
				let latestModified;
				for (const entry of processedEntries) if (entry.cacheHint) {
					if (entry.cacheHint.tags) entry.cacheHint.tags.forEach((tag) => entryTags.add(tag));
					if (entry.cacheHint.lastModified instanceof Date) {
						if (latestModified === void 0 || entry.cacheHint.lastModified > latestModified) latestModified = entry.cacheHint.lastModified;
					}
				}
				if (entryTags.size > 0 || latestModified || cacheHint) {
					const mergedCacheHint = {};
					if (cacheHint?.tags || entryTags.size > 0) mergedCacheHint.tags = [.../* @__PURE__ */ new Set([...cacheHint?.tags || [], ...entryTags])];
					if (cacheHint?.lastModified && latestModified) mergedCacheHint.lastModified = cacheHint.lastModified > latestModified ? cacheHint.lastModified : latestModified;
					else if (cacheHint?.lastModified || latestModified) mergedCacheHint.lastModified = cacheHint?.lastModified ?? latestModified;
					cacheHint = mergedCacheHint;
				}
			}
			return {
				entries: processedEntries,
				cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading collection ${collection}${error instanceof Error ? `: ${error.message}` : ""}`, error) };
		}
	};
}
function createGetLiveEntry({ liveCollections }) {
	return async function getLiveEntry(collection, lookup) {
		if (!(collection in liveCollections)) return { error: new LiveCollectionError(collection, `Collection "${collection}" is not a live collection. Use getCollection() instead of getLiveEntry() to load regular content collections.`) };
		try {
			const lookupObject = {
				filter: typeof lookup === "string" ? { id: lookup } : lookup,
				collection
			};
			let entry = await liveCollections[collection].loader?.loadEntry?.(lookupObject);
			if (entry && "error" in entry) return { error: entry.error };
			if (!entry) return { error: new LiveEntryNotFoundError(collection, lookup) };
			const { schema } = liveCollections[collection];
			if (schema) {
				const result = await parseLiveEntry(entry, schema, collection);
				if (result.error) return { error: result.error };
				entry = result.entry;
			}
			return {
				entry,
				cacheHint: entry.cacheHint
			};
		} catch (error) {
			return { error: new LiveCollectionError(collection, `Unexpected error loading entry ${collection} → ${typeof lookup === "string" ? lookup : JSON.stringify(lookup)}`, error) };
		}
	};
}
var CONTENT_LAYER_IMAGE_REGEX = /__ASTRO_IMAGE_="([^"]+)"/g;
async function updateImageReferencesInBody(html, fileName) {
	const { default: imageAssetMap } = await import("./content-assets_CLeMUEVR.mjs");
	const imageObjects = /* @__PURE__ */ new Map();
	const { getImage } = await import("./_virtual_astro_get-image_fnAPJb0q.mjs");
	for (const [_full, imagePath] of html.matchAll(CONTENT_LAYER_IMAGE_REGEX)) try {
		const decodedImagePath = JSON.parse(imagePath.replace(/&(?:#x22|quot);/g, "\"").replace(/&(?:#x27|apos);/g, "'").replace(/&(?:amp|#x26|#38);/g, "&"));
		let image;
		if (URL.canParse(decodedImagePath.src)) image = await getImage(decodedImagePath);
		else {
			const id = imageSrcToImportId(decodedImagePath.src, fileName);
			const imported = imageAssetMap.get(id);
			if (!id || imageObjects.has(id) || !imported) continue;
			image = await getImage({
				...decodedImagePath,
				src: imported
			});
		}
		imageObjects.set(imagePath, image);
	} catch {
		throw new Error(`Failed to parse image reference: ${imagePath}`);
	}
	return html.replaceAll(CONTENT_LAYER_IMAGE_REGEX, (full, imagePath) => {
		const image = imageObjects.get(imagePath);
		if (!image) return full;
		const { index, ...attributes } = image.attributes;
		return Object.entries({
			...attributes,
			src: image.src,
			...image.srcSet.values.length > 0 ? { srcset: image.srcSet.attribute } : {}
		}).filter(([, value]) => value != null).map(([key, value]) => value === "" ? `${key}=""` : `${key}="${escape(String(value))}"`).join(" ");
	});
}
/**
* Resolves the image src at `path` within `data` to its `ImageMetadata` (or a
* renderable SVG component). Returns the resolved value, or `undefined` when the
* image is not in the asset map and the plain src already stored in `data` should
* be kept.
*/
function resolveImageAtPath(src, fileName, imageAssetMap) {
	const id = imageSrcToImportId(src, fileName);
	if (!id) return;
	const imported = imageAssetMap?.get(id);
	if (!imported) return;
	if (imported.__svgData) {
		const { __svgData: svgData, ...meta } = imported;
		return createSvgComponent({
			meta,
			...svgData
		});
	}
	return imported;
}
/**
* Writes `value` at `path` within `target`, copying only the containers along
* that path so the shared store entry is never mutated. Sibling values and every
* container off the path are shared by reference, so values that `structuredClone`
* cannot handle (e.g. `Temporal` objects or class instances from Zod transforms)
* are never touched.
*/
function setAtPathCopying(target, path, value) {
	if (path.length === 0) return target;
	const [key, ...rest] = path;
	const copy = Array.isArray(target) ? target.slice() : { ...target };
	copy[key] = rest.length === 0 ? value : setAtPathCopying(copy[key], rest, value);
	return copy;
}
function updateImageReferencesInData(data, fileName, imageAssetMap, imageImports) {
	if (!imageImports?.length) return data;
	let result = data;
	for (const path of imageImports) {
		let src = result;
		for (const key of path) src = src?.[key];
		if (typeof src !== "string") continue;
		const resolved = resolveImageAtPath(src, fileName, imageAssetMap);
		if (resolved !== void 0) result = setAtPathCopying(result, path, resolved);
	}
	return result;
}
function resolveEntryData(entry, imageAssetMap) {
	return updateImageReferencesInData(entry.data, entry.filePath, imageAssetMap, entry.imageImports);
}
function createRenderEntry({ logger }) {
	return async function renderEntry(entry) {
		if (!entry) throw new AstroError(RenderUndefinedEntryError);
		recordContentEntryRender(entry.filePath);
		if (entry.deferredRender) try {
			const { default: contentModules } = await import("./content-modules_DYcV8QGo.mjs");
			const renderEntryImport = contentModules.get(entry.filePath);
			return render$1({
				collection: "",
				id: entry.id,
				renderEntryImport
			});
		} catch (e) {
			logger.error("content", `${e}`);
		}
		const html = entry?.rendered?.metadata?.imagePaths?.length && entry.filePath ? await updateImageReferencesInBody(entry.rendered.html, entry.filePath) : entry?.rendered?.html;
		return {
			Content: createComponent(() => renderTemplate`${unescapeHTML(html)}`),
			headings: entry?.rendered?.metadata?.headings ?? [],
			remarkPluginFrontmatter: entry?.rendered?.metadata?.frontmatter ?? {}
		};
	};
}
async function render$1({ collection, id, renderEntryImport }) {
	const UnexpectedRenderError = new AstroError({
		...UnknownContentCollectionError,
		message: `Unexpected error while rendering ${String(collection)} → ${String(id)}.`
	});
	if (typeof renderEntryImport !== "function") throw UnexpectedRenderError;
	const baseMod = await renderEntryImport();
	if (baseMod == null || typeof baseMod !== "object") throw UnexpectedRenderError;
	const { default: defaultMod } = baseMod;
	if (isPropagatedAssetsModule(defaultMod)) {
		const { collectedStyles, collectedLinks, collectedScripts, getMod } = defaultMod;
		if (typeof getMod !== "function") throw UnexpectedRenderError;
		const propagationMod = await getMod();
		if (propagationMod == null || typeof propagationMod !== "object") throw UnexpectedRenderError;
		return {
			Content: createComponent({
				factory(result, baseProps, slots) {
					let styles = "", links = "", scripts = "";
					if (Array.isArray(collectedStyles)) styles = collectedStyles.map((style) => {
						const content = typeof style === "string" ? style : style.content;
						const viteDevId = typeof style === "object" && style.id ? style.id : void 0;
						return renderUniqueStylesheet(result, {
							type: "inline",
							content,
							viteDevId
						});
					}).join("");
					if (Array.isArray(collectedLinks)) links = collectedLinks.map((link) => {
						return renderUniqueStylesheet(result, {
							type: "external",
							src: isRemotePath(link) ? link : prependForwardSlash(link)
						});
					}).join("");
					if (Array.isArray(collectedScripts)) scripts = collectedScripts.map((script) => renderScriptElement(script)).join("");
					let props = baseProps;
					if (id.endsWith("mdx")) props = {
						components: propagationMod.components ?? {},
						...baseProps
					};
					return createHeadAndContent(unescapeHTML(styles + links + scripts), renderTemplate`${renderComponent(result, "Content", propagationMod.Content, props, slots)}`);
				},
				propagation: "self"
			}),
			headings: propagationMod.getHeadings?.() ?? [],
			remarkPluginFrontmatter: propagationMod.frontmatter ?? {}
		};
	} else if (baseMod.Content && typeof baseMod.Content === "function") return {
		Content: baseMod.Content,
		headings: baseMod.getHeadings?.() ?? [],
		remarkPluginFrontmatter: baseMod.frontmatter ?? {}
	};
	else throw UnexpectedRenderError;
}
function isPropagatedAssetsModule(module) {
	return typeof module === "object" && module != null && "__astroPropagation" in module;
}
// \0astro:content
var liveCollections = {};
var logger = createConsoleLogger({ level });
var getCollection = createGetCollection({
	liveCollections,
	logger
});
createGetEntry({
	liveCollections,
	logger
});
var render = /* @__PURE__ */ createRenderEntry({ logger });
createGetLiveCollection({ liveCollections });
createGetLiveEntry({ liveCollections });
// src/data/opportunities.json
var opportunities_default = /*#__PURE__*/ JSON.parse("[{\"category\":\"government\",\"deadline\":\"2026-12-07\",\"eligibility\":\"2+ years relevant experience; 15 vacancies, BPS-06, contract. Check the full post on njp.gov.pk for trade-specific requirements.\",\"fees\":\"No application fee stated on the portal listing — confirm on njp.gov.pk before applying.\",\"location\":\"Karachi, Sindh (Karachi Port Trust)\",\"organization\":\"Karachi Port Trust (via National Job Portal)\",\"procedure\":\"Open njp.gov.pk, search for the Karachi Port Trust Lascar post, read the full advertisement, then apply online through the portal before 7 December 2026.\",\"sourceUrl\":\"https://njp.gov.pk/\",\"status\":\"open\",\"title\":\"Lascar (KPT PS-03) — Karachi Port Trust\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-12-07\",\"eligibility\":\"2+ years relevant experience; 3 vacancies, BPS-06, contract. Check the full post on njp.gov.pk for trade-specific requirements.\",\"fees\":\"No application fee stated on the portal listing — confirm on njp.gov.pk before applying.\",\"location\":\"Karachi, Sindh (Karachi Port Trust)\",\"organization\":\"Karachi Port Trust (via National Job Portal)\",\"procedure\":\"Open njp.gov.pk, search for the Karachi Port Trust Greaser post, read the full advertisement, then apply online through the portal before 7 December 2026.\",\"sourceUrl\":\"https://njp.gov.pk/\",\"status\":\"open\",\"title\":\"Greaser (KPT PS-03) — Karachi Port Trust\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-12-07\",\"eligibility\":\"2+ years relevant experience; 6 vacancies, BPS-06, contract. Check the full post on njp.gov.pk for trade-specific requirements.\",\"fees\":\"No application fee stated on the portal listing — confirm on njp.gov.pk before applying.\",\"location\":\"Karachi, Sindh (Karachi Port Trust)\",\"organization\":\"Karachi Port Trust (via National Job Portal)\",\"procedure\":\"Open njp.gov.pk, search for the Karachi Port Trust Fire Driver post, read the full advertisement, then apply online through the portal before 7 December 2026.\",\"sourceUrl\":\"https://njp.gov.pk/\",\"status\":\"open\",\"title\":\"Fire Driver (KPT PS-03) — Karachi Port Trust\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-12-07\",\"eligibility\":\"3+ years relevant experience; 1 vacancy, BPS-08, contract. Check the full post on njp.gov.pk for trade-specific requirements.\",\"fees\":\"No application fee stated on the portal listing — confirm on njp.gov.pk before applying.\",\"location\":\"Karachi, Sindh (Karachi Port Trust)\",\"organization\":\"Karachi Port Trust (via National Job Portal)\",\"procedure\":\"Open njp.gov.pk, search for the Karachi Port Trust Syrang post, read the full advertisement, then apply online through the portal before 7 December 2026.\",\"sourceUrl\":\"https://njp.gov.pk/\",\"status\":\"open\",\"title\":\"Syrang (KPT PS-04) — Karachi Port Trust\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Punjab domicile; second-division graduation degree from a recognised university, completed on or before 30 November 2026; upper age limit 32 years (raised from 30). 45 Provincial Management Service, 1 Excise & Taxation Officer, 2 Assistant Director Local Fund Audit posts.\",\"fees\":\"Rs 1,000 (as listed for Advertisement 12/2026 — confirm the exact fee on ppsc.gop.pk before paying).\",\"location\":\"Punjab, Pakistan\",\"organization\":\"Punjab Public Service Commission (PPSC)\",\"procedure\":\"Open ppsc.gop.pk, find Advertisement No. 12/2026, read the full advertisement and important instructions, then apply online only before midnight on 30 November 2026. Offline applications are not accepted.\",\"sourceUrl\":\"https://www.ppsc.gop.pk/\",\"status\":\"open\",\"title\":\"PPSC Combined Competitive Examination (PMS) 2026 — 48 BS-17 posts (Advertisement 12/2026)\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-12-07\",\"eligibility\":\"Punjab domicile; qualifications vary by post (18 job titles) — read the post-wise requirements in Advertisement No. 13/2026 on ppsc.gop.pk before applying.\",\"fees\":\"Fee varies by post — check the fee column for your post in Advertisement 13/2026 on ppsc.gop.pk before paying.\",\"location\":\"Punjab, Pakistan\",\"organization\":\"Punjab Public Service Commission (PPSC)\",\"procedure\":\"Open ppsc.gop.pk, find Advertisement No. 13/2026, select the case number for your post, read its requirements, then apply online before 7 December 2026.\",\"sourceUrl\":\"https://www.ppsc.gop.pk/\",\"status\":\"open\",\"title\":\"PPSC Advertisement 13/2026 — 225+ posts incl. Junior Patrol Officer, Junior Computer Operator, Assistant IT, Stenographer\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-11-25\",\"eligibility\":\"Only candidates who qualified the MPT CE-2027 screening test; bachelor's degree; age, qualification and domicile assessed against the 31 December 2026 cutoff.\",\"fees\":\"Rs 2,200 (paid via PSID before the online deadline).\",\"location\":\"Pakistan (written exam in 19 cities, tentatively from 27 January 2027)\",\"organization\":\"Federal Public Service Commission (FPSC)\",\"procedure\":\"Online applications closed on 25 November 2026. Candidates who applied online in time must still send the signed printed application with supporting documents to FPSC, Aga Khan Road, F-5/1, Islamabad, before 4 December 2026. Check fpsc.gov.pk for the next cycle.\",\"sourceUrl\":\"https://www.fpsc.gov.pk/\",\"status\":\"closed\",\"title\":\"FPSC CSS Competitive Examination CE-2027 — Written Examination (online applications CLOSED 25 Nov 2026)\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Punjab domicile only; master's/postgraduate degree for most posts; age below 50/45/40 depending on the post; 13 positions (14 posts — Training Coordinator x2), contract 1–5 years. Read each position on the Punjab Job Portal before applying.\",\"fees\":\"No fee stated in the advertisement summary — check the portal listing; courier cost for documents applies.\",\"location\":\"Lahore, Punjab\",\"organization\":\"Program Implementation Unit (PIU), Specialized Healthcare & Medical Education Department, Government of the Punjab\",\"procedure\":\"Apply online at jobs.punjab.gov.pk (search PIU / IPL-12001) AND send attested supporting documents by registered courier to the PIU office, Johar Town, Lahore — both must reach by 5:00 PM on 30 November 2026. Hand-delivered applications are not accepted.\",\"sourceUrl\":\"https://jobs.punjab.gov.pk/\",\"status\":\"open\",\"title\":\"Punjab PIU — 13 contract positions, Punjab Nursing and Health Workforce Reform Program (IPL-12001)\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Varies by post — read the full job description for your post on jobs.gov.pk; project posts under the Prime Minister's Youth Skills Development Program (Balochistan Special Initiative), PPS-08 to PPS-11.\",\"fees\":\"No application fee stated — confirm on jobs.gov.pk before applying.\",\"location\":\"Quetta, Karachi and Hub-Lasbela, Pakistan\",\"organization\":\"National Vocational and Technical Training Commission (NAVTTC)\",\"procedure\":\"Open jobs.gov.pk (National Employment Exchange / NEXT), find the NAVTTC PMYSDP vacancies, read the complete job description for your post, then apply online before 30 November 2026. No postal applications.\",\"sourceUrl\":\"https://jobs.gov.pk/\",\"status\":\"open\",\"title\":\"NAVTTC PMYSDP Project Posts — PPS-08 to PPS-11 (12 posts, Quetta / Karachi / Hub-Lasbela)\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"government\",\"deadline\":null,\"eligibility\":\"Varies by job; to apply you need a verified email, personal details and at least one qualification on your profile. Experience is needed only when the job asks for it.\",\"fees\":\"Free to register and apply.\",\"location\":\"Pakistan (nationwide + overseas)\",\"organization\":\"NAVTTC / Government of Pakistan\",\"procedure\":\"Register on jobs.gov.pk and verify your email, complete your profile and resume, then search live jobs and apply online. On 26 November 2026 the homepage listed 2,193 government jobs and 86,501 overseas jobs. Helpline: 0800-88866.\",\"sourceUrl\":\"https://jobs.gov.pk/\",\"status\":\"open\",\"title\":\"National Employment Exchange (NEXT) — live government & overseas jobs portal\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"scholarship\",\"deadline\":\"2026-12-14\",\"eligibility\":\"Valid domicile/local certificate of Balochistan or erstwhile FATA (applicant and father); age 22 years or younger on the closing date; 12 years of education (FA/FSc/ICom/ICS/DAE or equivalent) with at least 60% marks. 500 scholarships for Balochistan, 500 for erstwhile FATA; covers tuition/hostel up to Rs 200,000/year plus Rs 12,000/month stipend.\",\"fees\":\"Rs 2,000 aptitude test fee, non-refundable, via 1Link 1Bill.\",\"location\":\"Pakistan (HEC-recognised universities nationwide)\",\"organization\":\"Higher Education Commission (HEC) Pakistan\",\"procedure\":\"Apply online only through the HEC scholarship portal via hec.gov.pk/site/bf3 (eportal.hec.gov.pk), upload required documents, pay the test fee via 1Link 1Bill and verify payment on the portal, then submit before 14 December 2026. Hard copies are not required at this stage.\",\"sourceUrl\":\"https://www.hec.gov.pk/site/bf3\",\"status\":\"open\",\"title\":\"HEC Undergraduate Scholarships 2026–27 — Balochistan & Erstwhile FATA (Phase-III, Batch-V, 1,000 scholarships)\",\"type\":\"scholarship\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"scholarship\",\"deadline\":null,\"eligibility\":\"PhD applicants to US universities — full eligibility, fields and terms are published on hec.gov.pk; confirm them there before preparing documents.\",\"fees\":\"No fee stated — check hec.gov.pk.\",\"location\":\"United States of America\",\"organization\":\"Higher Education Commission (HEC) Pakistan\",\"procedure\":\"Check hec.gov.pk for the current Knowledge Corridor round. Rolling applications were reported, with a next stated closing of 30 March for the Fall 2027 session — this date is unconfirmed, so verify it on the official HEC page before applying.\",\"sourceUrl\":\"https://www.hec.gov.pk/\",\"status\":\"unverified\",\"title\":\"US–Pakistan Knowledge Corridor PhD Scholarship (USA) — check HEC for current round\",\"type\":\"scholarship\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Open to students, fresh graduates, job seekers and working professionals across Pakistan; CNIC details required at registration; maximum 2 courses per trainee; 12-week courses.\",\"fees\":\"100% free at every stage. Never pay anyone promising a guaranteed seat — registration is free.\",\"location\":\"Online (Pakistan)\",\"organization\":\"DigiSkills Training Program — Ministry of IT & Telecom / Ignite / Virtual University of Pakistan\",\"procedure\":\"Register only at digiskills.pk/Register.aspx, verify your email, then enrol in up to 2 of the 24 courses. Enrolment is first come, first served and can close early when seats fill — do not wait for the advertised date. Classes begin 1 December 2026.\",\"sourceUrl\":\"https://digiskills.pk/\",\"status\":\"open\",\"title\":\"DigiSkills 3.0 Batch 05 — 24 free online courses (300,000 seats)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Open to students, graduates, job seekers and professionals across Pakistan; one of the 24 Batch 05 courses, maximum 2 courses per trainee.\",\"fees\":\"Free. Never pay anyone for a seat.\",\"location\":\"Online (Pakistan)\",\"organization\":\"DigiSkills Training Program — Ministry of IT & Telecom / Ignite / Virtual University of Pakistan\",\"procedure\":\"Register at digiskills.pk/Register.aspx, verify your email, then select Freelancing as one of your two Batch 05 courses. Classes begin 1 December 2026; enrolment is first come, first served.\",\"sourceUrl\":\"https://digiskills.pk/\",\"status\":\"open\",\"title\":\"DigiSkills — Freelancing (free online course, Batch 05)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":\"2026-11-30\",\"eligibility\":\"Open to students, graduates, job seekers and professionals across Pakistan; one of the 24 Batch 05 courses, maximum 2 courses per trainee.\",\"fees\":\"Free. Never pay anyone for a seat.\",\"location\":\"Online (Pakistan)\",\"organization\":\"DigiSkills Training Program — Ministry of IT & Telecom / Ignite / Virtual University of Pakistan\",\"procedure\":\"Register at digiskills.pk/Register.aspx, verify your email, then select Artificial Intelligence using Python as one of your two Batch 05 courses. Classes begin 1 December 2026; enrolment is first come, first served.\",\"sourceUrl\":\"https://digiskills.pk/\",\"status\":\"open\",\"title\":\"DigiSkills — Artificial Intelligence using Python (free online course, Batch 05)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Pakistani citizen aged 18–35 with a valid CNIC or Form-B (per programme rules — confirm the current batch notice on the NSIS portal). Latest batch: 75,000+ trainees across 866 institutes in 103 trades.\",\"fees\":\"Free training under PMYSDP.\",\"location\":\"Pakistan (866 partner institutes nationwide)\",\"organization\":\"National Vocational and Technical Training Commission (NAVTTC)\",\"procedure\":\"Check the NSIS portal (nsis.navttc.gov.pk, linked from navttc.gov.pk) for the next open batch. Batch-III classes started in February 2026 and no next-batch date had been announced as of 26 November 2026. For updates call the NAVTTC helpline 0800-88866 (Mon–Fri, 08:00–16:00).\",\"sourceUrl\":\"https://navttc.gov.pk/\",\"status\":\"unverified\",\"title\":\"NAVTTC Prime Minister's Youth Skills Development Program (PMYSDP) — free vocational & high-tech training\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Open to everyone; no prior experience needed; self-paced. Skills taught include HTML, CSS, JavaScript, Python, Linux, Git, SQL, data science and AI.\",\"fees\":\"100% free — courses, projects and certifications.\",\"location\":\"Online\",\"organization\":\"freeCodeCamp (501(c)(3) nonprofit)\",\"procedure\":\"Create a free account at freecodecamp.org and start at the beginning of the core curriculum. Each free verified certification requires building its 5 certification projects and passing all project tests.\",\"sourceUrl\":\"https://www.freecodecamp.org/\",\"status\":\"open\",\"title\":\"freeCodeCamp — Free coding certifications (Web Design, JavaScript, Python, Data Science, AI)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Free for learners, teachers and families; open to everyone, self-paced, in 50+ languages.\",\"fees\":\"Free for learners, teachers and families.\",\"location\":\"Online\",\"organization\":\"Khan Academy (nonprofit)\",\"procedure\":\"Create a free account at khanacademy.org, choose a subject and learn at your own pace with practice exercises and mastery tracking.\",\"sourceUrl\":\"https://www.khanacademy.org/\",\"status\":\"open\",\"title\":\"Khan Academy — Free courses in maths, science, computing and more\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Open to everyone; free Microsoft account needed to track progress.\",\"fees\":\"Free learning content; some applied-skills assessments and certifications are paid — check the individual path page.\",\"location\":\"Online\",\"organization\":\"Microsoft\",\"procedure\":\"Open learn.microsoft.com, pick a learning path (e.g. AI, Azure or Copilot essentials), and work through the free modules at your own pace.\",\"sourceUrl\":\"https://learn.microsoft.com/\",\"status\":\"open\",\"title\":\"Microsoft Learn — Free learning paths (AI, Azure, Copilot and more)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Open to everyone; a Google account is needed to sign in.\",\"fees\":\"Free training and certification.\",\"location\":\"Online\",\"organization\":\"Google\",\"procedure\":\"Sign in at skillshop.withgoogle.com, choose a track such as Google Ads or Google Analytics, complete the e-learning courses and pass the certification assessment.\",\"sourceUrl\":\"https://skillshop.withgoogle.com/\",\"status\":\"open\",\"title\":\"Google Skillshop — Free Google Ads & Google Analytics certifications\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"course\",\"deadline\":null,\"eligibility\":\"Open to everyone; a free Coursera account is needed.\",\"fees\":\"Free to audit / preview the first module of many courses; certificates and full access are paid (Coursera Plus was listed at $239/year on 26 Nov 2026); financial aid is available on many courses — apply on the course page.\",\"location\":\"Online\",\"organization\":\"Coursera\",\"procedure\":\"Create a free account at coursera.org, open a course and choose the free audit/preview option (many courses let you preview the first module free, including video lessons, readings and graded assignments). Some courses, e.g. Claude Code 101, are free without a certificate.\",\"sourceUrl\":\"https://www.coursera.org/\",\"status\":\"open\",\"title\":\"Coursera — Free courses to audit (incl. free courses without certificate)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"ai-tools\",\"deadline\":null,\"eligibility\":\"Beginner level, no experience needed; under 5 hours (Google lists under 10 hours for the full specialisation).\",\"fees\":\"7-day free trial, then about $20/month in Pakistan ($49/month in the US/Canada) — check the price shown to you; financial aid available.\",\"location\":\"Online\",\"organization\":\"Google (via Coursera)\",\"procedure\":\"Enrol on Coursera and search for Google AI Essentials. Do not treat the 7-day free trial as a free course — it becomes a paid subscription unless cancelled. If you cannot pay, apply for financial aid via the 'Financial aid available' link on the course page; if approved, you get the course and certificate.\",\"sourceUrl\":\"https://www.coursera.org/\",\"status\":\"open\",\"title\":\"Google AI Essentials (Coursera) — beginner AI course (NOT free — paid, financial aid available)\",\"type\":\"course\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"freelancing\",\"deadline\":null,\"eligibility\":\"Open to adults with a marketable skill (e.g. web development, design, writing, data entry, virtual assistance). Pakistani freelancers are active on the platform — the homepage on 26 November 2026 featured a freelancer from Faisalabad, Pakistan.\",\"fees\":\"Free to join; Upwork charges a service fee on freelancer earnings — check the current fee schedule on upwork.com before starting. Income is NOT guaranteed and finding first clients takes time.\",\"location\":\"Online / Remote (Pakistan)\",\"organization\":\"Upwork\",\"procedure\":\"Create a freelancer profile with real portfolio samples, apply to posted jobs, and use Upwork's escrow/milestone payments — release payment only after approved work. Never pay anyone for a 'guaranteed' job.\",\"sourceUrl\":\"https://www.upwork.com/\",\"status\":\"open\",\"title\":\"Upwork — Find freelance work online (guide; no guaranteed income)\",\"type\":\"guide\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"freelancing\",\"deadline\":null,\"eligibility\":\"Open to anyone who can offer a service (design, development, marketing, writing, video, AI services). Freelancers have public profiles with reviews and portfolios.\",\"fees\":\"Free to join and create gigs; Fiverr deducts a commission from completed orders — check the current terms on fiverr.com. Income is NOT guaranteed.\",\"location\":\"Online / Remote (Pakistan)\",\"organization\":\"Fiverr\",\"procedure\":\"Create a free seller account, publish gigs describing exactly what you deliver, message buyers directly, and deliver through Fiverr. Buyer payments are held securely and released only once work is approved or the review period passes; the Resolution Center handles disputes.\",\"sourceUrl\":\"https://www.fiverr.com/\",\"status\":\"open\",\"title\":\"Fiverr — Sell freelance services online (guide; no guaranteed income)\",\"type\":\"guide\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"freelancing\",\"deadline\":null,\"eligibility\":\"Open to anyone with a skill across 2,700+ categories (design, development, writing, data, AI and more).\",\"fees\":\"Free to join and bid; the platform charges fees/commissions on projects — check the current terms on freelancer.com. Income is NOT guaranteed.\",\"location\":\"Online / Remote (Pakistan)\",\"organization\":\"Freelancer.com\",\"procedure\":\"Create a free account, browse posted projects, place competitive bids that suit your budget and skills, and use the milestone payment system — pay only when satisfied with the outcome.\",\"sourceUrl\":\"https://www.freelancer.com/\",\"status\":\"open\",\"title\":\"Freelancer.com — Bid on freelance projects worldwide (guide; no guaranteed income)\",\"type\":\"guide\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"remote\",\"deadline\":null,\"eligibility\":\"Varies by listing — read each post's location line and apply only where it says Pakistan, Asia, APAC, Anywhere or Worldwide. A complete profile with skills and portfolio helps recruiters find you.\",\"fees\":\"Free to create a profile and apply; LinkedIn Premium is optional and paid.\",\"location\":\"Pakistan (Remote)\",\"organization\":\"LinkedIn\",\"procedure\":\"Open linkedin.com/jobs, set location to Pakistan, turn on the Remote filter, set job alerts (daily or weekly), and apply to fresh posts. Turn on 'Open to Work' on your profile so recruiters can find you.\",\"sourceUrl\":\"https://www.linkedin.com/jobs/\",\"status\":\"open\",\"title\":\"LinkedIn — Remote jobs in Pakistan (1,000+ remote listings)\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"internship\",\"deadline\":\"2026-11-14\",\"eligibility\":\"As listed on jobs.gov.pk for the PMYSDP internship posts (15 internships under the Prime Minister's Youth Skills Development Program).\",\"fees\":\"No fee stated; no TA/DA admissible.\",\"location\":\"Islamabad, Pakistan\",\"organization\":\"National Vocational and Technical Training Commission (NAVTTC)\",\"procedure\":\"Applications were online only via jobs.gov.pk; the deadline passed on 14 November 2026. Check jobs.gov.pk and navttc.gov.pk for the next internship round — do not apply to this closed round.\",\"sourceUrl\":\"https://jobs.gov.pk/\",\"status\":\"closed\",\"title\":\"NAVTTC PMYSDP Internships (15 posts, Islamabad) — CLOSED (deadline passed 14 Nov 2026)\",\"type\":\"internship\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Minimum 1 year of customer support or call centre experience (required); Intermediate (FA/FSc, ICS, I.Com) or equivalent; excellent spoken English; able to work permanent night shifts (6:30 PM – 3:30 AM, Mon–Fri).\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"College Road, Township, Lahore, Punjab\",\"organization\":\"The Ultimate Solutions\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs via WhatsApp at 0315-0577531.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=3e1e527455c36e3f\",\"status\":\"open\",\"title\":\"Customer Service Representative (Night Shift) — The Ultimate Solutions\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Intermediate, bachelor's degree or equivalent; previous customer service, telesales, call centre, healthcare, beauty or salon experience preferred; excellent English and Urdu communication; good computer skills (MS Office, Google Sheets).\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Islampura, Lahore, Punjab\",\"organization\":\"Smart Aesthetics\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=fc9e4a365d2f7303\",\"status\":\"open\",\"title\":\"Customer Service Representative (CSR) — Smart Aesthetics\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Excellent communication in English and Urdu; confident telephone manner; basic computer and CRM skills; previous telemarketing, customer service or call centre experience preferred; graduates with strong communication skills are encouraged to apply.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Johar Town, Lahore, Punjab\",\"organization\":\"Aptitude Migration Pty Ltd\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by email at careers@aptitudemigration.com.au (subject: CSR Application – Lahore).\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=c00ce027093d68fb\",\"status\":\"open\",\"title\":\"Customer Service Representative (CSR) – Lead Calling & Follow-Up — Aptitude Migration\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"3–5 years of proven customer service experience (salon, spa, hospitality or luxury service preferred); excellent English and Urdu communication; presentable and customer-focused.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"13-Q Block, Model Town Extension, Lahore, Punjab\",\"organization\":\"H one Salon & Aesthetic\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by phone/WhatsApp at 0309-6774036 or 0301-3336675.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=8aa26c16db4da244\",\"status\":\"open\",\"title\":\"Customer Service Representative (Female) — H one Salon & Aesthetic\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"1+ years of experience in an international call centre, customer service or outbound BPO (US/UK/international clients); exceptional spoken and written English; able to work 100% on-site night shifts (6:00 PM – 3:00 AM, Mon–Fri) in Johar Town.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Johar Town (near Emporium Mall), Lahore, Punjab\",\"organization\":\"Doctors Urgent Care Group\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=352f24a019eec804\",\"status\":\"open\",\"title\":\"Customer Support Representative (Female) — Doctors Urgent Care Group\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"1–2 years of experience in customer support, customer service, call centre or a similar role; excellent English and Urdu communication; basic computer and MS Office skills; willing to work day or night shifts.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Johar Town, Lahore, Punjab\",\"organization\":\"WBM Pvt. Ltd.\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by email at hr@wbm.com.pk.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=0c95449eebb9ea92\",\"status\":\"open\",\"title\":\"Call Center Agent — WBM Pvt. Ltd.\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"2–3 years of experience in Sales Dispatch; strong communication, listening, negotiation and closing skills; able to work night shifts (6:00 PM – 3:00 AM).\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Johar Town (opposite Emporium Mall, Gate 3), Lahore, Punjab\",\"organization\":\"IGET SOLUTIONS PVT LTD\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=a70e915307ffede8\",\"status\":\"open\",\"title\":\"Sales Agent — IGET SOLUTIONS PVT LTD\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Minimum 1 year of proven experience in outbound cold calling, telemarketing or sales (agency experience a plus); exceptional spoken and written English; target-driven; comfortable with the 3:00 PM – 11:00 PM on-site shift in Gulberg III.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Gulberg III, Lahore, Punjab\",\"organization\":\"BB Technologies\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by email at hr@bbtechnologys.com (subject: Customer Sales Representative – [Your Name]).\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=f74faec195ecbd05\",\"status\":\"open\",\"title\":\"Customer Sales Representative — BB Technologies\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Bachelor's degree preferred (Intermediate/A-Levels with relevant experience considered); 1–2 years in an aesthetic, dermatology or high-end salon setup is a plus; excellent Urdu and functional English; comfortable with appointment software, WhatsApp Business, Excel and POS.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"WAPDA Town, Lahore, Punjab\",\"organization\":\"One Aesthetics\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=b00f96ae4aba22b5\",\"status\":\"open\",\"title\":\"Front Desk Receptionist / Clinic Coordinator (Female) — One Aesthetics\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Excellent verbal and written communication; strong interpersonal and customer service skills; good organisation and time management; basic computer proficiency (email, MS Office); previous reception, customer service or admin experience preferred.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Garden Town, Lahore, Punjab\",\"organization\":\"Binary Coworking Space\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=9db7b7a4dca1daeb\",\"status\":\"open\",\"title\":\"Receptionist / Front Desk Officer — Binary Coworking Space\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Currently studying or recently completed a bachelor's in Marketing, Media Studies, Design, Film, Business or a related field (not mandatory with a strong portfolio); strong interest in social media, content creation and AI tools; basic Canva and video editing (CapCut/VN) a plus; on-site in Gulberg, Lahore, Mon–Fri (10:00 AM – 7:00 PM). 4-month internship.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Gulberg, Lahore, Punjab\",\"organization\":\"Kinetic Kube\",\"procedure\":\"Apply via Indeed with your updated CV AND email hr@kinetickube.co with subject 'Application – Marketing & AI Content Intern – Kinetic Kube – [Your Name]', including your CV, sample work links and a 2–3 minute intro video (only applications with the intro video are considered). Read the full listing on Indeed first.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=f2f62a970dc487af\",\"status\":\"open\",\"title\":\"Marketing & AI Content Intern — Kinetic Kube (On-Site, Lahore)\",\"type\":\"internship\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Good written and verbal English; basic to intermediate Google Sheets and MS Excel; familiarity with major social media platforms; good online research and data collection skills; freshers with good computer skills are welcome to apply.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Gulshan-e-Iqbal, Karachi, Sindh\",\"organization\":\"ABS International\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by email at nimra.shahzad@absinternational.pk.\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=f26c91a4c5592be8\",\"status\":\"open\",\"title\":\"Data Entry & Social Media Outreach Executive — ABS International\",\"type\":\"job\",\"verifiedDate\":\"2026-11-26\"},{\"category\":\"private\",\"deadline\":null,\"eligibility\":\"Basic MS Excel or Google Sheets; strong attention to detail; good typing speed and accuracy; willing to work night shifts (9:00 PM – 6:00 AM, Sat–Sun off); reliable and punctual. 4-month paid internship.\",\"fees\":\"Free to apply on Indeed — never pay anyone for a job or interview.\",\"location\":\"Gulistan-e-Jauhar, Block 12, Karachi, Sindh\",\"organization\":\"DigixSoft\",\"procedure\":\"Open the Indeed listing, read the full job description, then apply via Indeed. The employer also accepts CVs by email at hr.digixsoft@gmail.com (queries: 0311-2825797).\",\"sourceUrl\":\"https://pk.indeed.com/viewjob?jk=2e4ed94c9f6c666e\",\"status\":\"open\",\"title\":\"Data Entry / Lead Scraper Intern (Night Shift) — DigixSoft\",\"type\":\"internship\",\"verifiedDate\":\"2026-11-26\"}]");
// src/data/guides.ts
/** Derive the URL slug from a content entry's id (e.g. "my-guide.md" -> "my-guide"). */
function slugOf(entry) {
	return entry.id.replace(/\.md$/, "").replace(/\/index$/, "");
}
/** Today's calendar date in PKT (Asia/Karachi, UTC+5) as YYYY-MM-DD. */
function todayPKT(now = /* @__PURE__ */ new Date()) {
	return new Date(now.getTime() + 18e6).toISOString().slice(0, 10);
}
/**
* True when a guide's publish date is today (PKT) or earlier.
* Future-dated guides stay hidden until their date — they are not
* published before their publication date.
*/
function isPublished(entry, now = /* @__PURE__ */ new Date()) {
	const d = entry.data.date;
	return (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10)) <= todayPKT(now);
}
/** Keep only guides whose publish date is today (PKT) or earlier. */
function publishedGuides(entries, now = /* @__PURE__ */ new Date()) {
	return entries.filter((e) => isPublished(e, now));
}
// src/lib/content.ts
var OPPORTUNITY_COLUMNS = `title, company, department, location, province, education,
	qualification, experience, salary, job_type, category, type, status,
	verification_status, deadline, source_url, source_domain, description,
	eligibility, procedure, fees, verified_date, required_documents,
	published, created_at, updated_at`;
var GUIDE_COLUMNS = `id, slug, title, description, category, tags, body, featured,
	published, publish_date, seo_title, seo_description, author, image,
	image_alt, created_at, updated_at`;
function dateStr(d) {
	if (!d) return null;
	const dt = d instanceof Date ? d : new Date(d);
	if (Number.isNaN(dt.getTime())) return null;
	return dt.toISOString().slice(0, 10);
}
function toDate(d) {
	return d instanceof Date ? d : new Date(d);
}
/** Map one opportunities row onto the Opportunity interface the public
*  components (OpportunityCard / CategoryPage / jobPostingJsonLd) expect. */
function mapOpportunityRow(row) {
	return {
		title: row.title,
		organization: row.company,
		category: row.category,
		type: row.type,
		location: row.location ?? "",
		deadline: dateStr(row.deadline),
		sourceUrl: row.source_url,
		eligibility: row.eligibility ?? row.description ?? "",
		procedure: row.procedure ?? "",
		fees: row.fees ?? "",
		verifiedDate: dateStr(row.verified_date) ?? "",
		status: row.status
	};
}
function mapGuideRow(row) {
	const date = toDate(row.publish_date);
	const updated = toDate(row.updated_at);
	return {
		id: `${row.slug}.md`,
		slug: row.slug,
		collection: "guides",
		data: {
			title: row.title,
			description: row.description,
			category: row.category,
			tags: row.tags ?? [],
			date,
			updated,
			author: row.author ?? "Rozgar Raasta Team",
			featured: row.featured,
			...row.image ? { image: row.image } : {},
			...row.image_alt ? { imageAlt: row.image_alt } : {}
		},
		body: row.body,
		source: "database"
	};
}
function mapCollectionGuide(entry) {
	return {
		...entry,
		slug: slugOf(entry),
		body: entry.body ?? "",
		source: "collection",
		collectionEntry: entry
	};
}
function staticOpportunities() {
	return opportunities_default;
}
async function staticGuides() {
	return publishedGuides((await getCollection("guides")).sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf())).map(mapCollectionGuide);
}
/** All published opportunities, DB first, static JSON fallback. */
async function getOpportunities() {
	try {
		const result = await query(`SELECT ${OPPORTUNITY_COLUMNS} FROM opportunities
			 WHERE published = true ORDER BY created_at DESC`);
		if (result.rows.length > 0) return result.rows.map(mapOpportunityRow);
		console.warn("[content] opportunities table is empty — using static fallback");
	} catch (err) {
		console.warn("[content] opportunities DB read failed — using static fallback", err);
	}
	return staticOpportunities();
}
/** All published guides (PKT date gate), DB first, collection fallback.
*  Sorted by updated date, newest first — same order as before. */
async function getGuides() {
	const today = todayPKT();
	try {
		const result = await query(`SELECT ${GUIDE_COLUMNS} FROM guides
			 WHERE published = true ORDER BY publish_date DESC`);
		if (result.rows.length > 0) return result.rows.filter((row) => (dateStr(row.publish_date) ?? "") <= today).map(mapGuideRow).sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
		console.warn("[content] guides table is empty — using static fallback");
	} catch (err) {
		console.warn("[content] guides DB read failed — using static fallback", err);
	}
	return staticGuides();
}
/** One published guide by slug, DB first, collection fallback.
*  Returns null when the slug exists in neither (the page then 404s). */
async function getGuideBySlug(slug) {
	const today = todayPKT();
	try {
		const result = await query(`SELECT ${GUIDE_COLUMNS} FROM guides WHERE slug = $1 AND published = true`, [slug]);
		if (result.rows.length > 0) {
			const row = result.rows[0];
			if ((dateStr(row.publish_date) ?? "") <= today) return mapGuideRow(row);
			return null;
		}
	} catch (err) {
		console.warn("[content] guide DB read failed — using static fallback", err);
	}
	const entry = (await getCollection("guides")).find((e) => slugOf(e) === slug);
	if (!entry) return null;
	const [published] = publishedGuides([entry]);
	if (!published) return null;
	return mapCollectionGuide(published);
}
/** Real counts for the admin dashboard. Falls back to the static files
*  (labelled 'static') so the dashboard never errors when the DB is down. */
async function getDashboardCounts() {
	try {
		const opps = await query(`SELECT status, count(*) AS count FROM opportunities GROUP BY status`);
		const oppTotals = await query(`SELECT count(*) AS total, count(*) FILTER (WHERE published) AS published FROM opportunities`);
		const guides = await query(`SELECT published, count(*) AS count FROM guides GROUP BY published`);
		const totalOpps = Number(oppTotals.rows[0]?.total ?? 0);
		if (totalOpps === 0 && (await query(`SELECT count(*) AS c FROM guides`)).rows[0]?.c === "0") throw new Error("content tables are empty");
		const byStatus = new Map(opps.rows.map((r) => [r.status, Number(r.count)]));
		const guideCounts = new Map(guides.rows.map((r) => [r.published, Number(r.count)]));
		const published = guideCounts.get(true) ?? 0;
		const unpublished = guideCounts.get(false) ?? 0;
		return {
			source: "database",
			totalOpportunities: totalOpps,
			openOpportunities: byStatus.get("open") ?? 0,
			closedOpportunities: byStatus.get("closed") ?? 0,
			unverifiedOpportunities: byStatus.get("unverified") ?? 0,
			totalGuides: published + unpublished,
			publishedGuides: published,
			unpublishedGuides: unpublished
		};
	} catch (err) {
		console.warn("[content] dashboard counts DB read failed — using static fallback", err);
		const opps = staticOpportunities();
		const guides = await staticGuides();
		const allCollection = await getCollection("guides").catch(() => []);
		return {
			source: "static",
			totalOpportunities: opps.length,
			openOpportunities: opps.filter((o) => o.status === "open").length,
			closedOpportunities: opps.filter((o) => o.status === "closed").length,
			unverifiedOpportunities: opps.filter((o) => o.status === "unverified").length,
			totalGuides: allCollection.length,
			publishedGuides: guides.length,
			unpublishedGuides: allCollection.length - guides.length
		};
	}
}
/**
* Render a DB guide's Markdown body to HTML. Only admins author guides,
* but the HTML is still sanitised as a minimum step: <script> blocks,
* event-handler attributes, javascript: URLs and active embeds are
* stripped before the HTML reaches the page.
*/
function renderGuideBody(markdown) {
	return marked.parse(markdown, { async: false }).replace(/<script[\s\S]*?<\/script\s*>/gi, "").replace(/<iframe[\s\S]*?<\/iframe\s*>/gi, "").replace(/<(object|embed|form|style|link|meta|base)[\s\S]*?(?:<\/\1\s*>|\/>|>)/gi, "").replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "").replace(/\s+(href|src)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, "");
}
export { renderGuideBody as a, getOpportunities as i, getGuideBySlug as n, slugOf as o, getGuides as r, render as s, getDashboardCounts as t };
