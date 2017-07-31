package com.hz.cache.util;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hz.frm.util.Tools;

/**
 * Redis缓存服务工具
 * @author xie.yh
 */
public class RedisUtil {

	private static RedisTemplate<String, ?> redisTemplate;

	public void setRedisTemplate(RedisTemplate<String, ?> redisTemplate) {
		RedisUtil.redisTemplate = redisTemplate;
	}

	private static String formatHashName(String key){
		return key += "_HASH";
	}

	private static String formatListName(String key){
		return key += "_LIST";
	}
	
	private static String formatObjectName(String key){
		return key += "_OBJECT";
	}

	/**
	 * 获取RedisTempLate对象
	 * @return RedisTemplate
	 */
	public static RedisTemplate<String, ?> getTemplate(){
		return RedisUtil.redisTemplate;
	}
	
	/**
	 * 删除缓存对象
	 * @param cacheKey 缓存名
	 * @return
	 */
	public static void deleteObject(String cacheKey){
		redisTemplate.delete( formatObjectName(cacheKey) );
	}

	/**
	 * 删除缓存对象
	 * @param cacheKey 缓存名
	 * @return
	 */
	public static void deleteHash(String cacheKey){
		redisTemplate.delete( formatHashName(cacheKey) );
	}

	/**
	 * 删除缓存
	 * @param cacheKey 缓存名
	 * @param keys 缓存KEY
	 */
	public static void deleteHash(String cacheKey, Object... keys){
		redisTemplate.opsForHash().delete( formatHashName(cacheKey), keys );
	}

	/**
	 * 删除缓存对象
	 * @param cacheKey 缓存名
	 * @return
	 */
	public static void deleteList(String cacheKey){
		redisTemplate.delete( formatListName(cacheKey) );
	}

	/**
	 * 是否存在
	 * @param cacheKey
	 * @param keys
	 */
	public static boolean hasKey(String cacheKey, Object key){
		return redisTemplate.opsForHash().hasKey( formatHashName(cacheKey), key );
	}
	
	/**
	 * 是否存在
	 * @param cacheKey
	 * @param keys
	 */
	public static boolean hasKey(String cacheKey){
		return redisTemplate.hasKey( formatObjectName(cacheKey));
	}

	@SuppressWarnings("unchecked")
	public static ListOperations<String, String> opsForList(){
		return (ListOperations<String, String>) redisTemplate.opsForList();
	}
	
	@SuppressWarnings("unchecked")
	private static BoundListOperations<String, String>  opsForBound(String cacheKey){
		return (BoundListOperations<String, String>)redisTemplate.boundListOps(cacheKey);
	}
	
	@SuppressWarnings("unchecked")
	private static ValueOperations<String, Object> opsForValue(){
		return (ValueOperations<String, Object>) redisTemplate.opsForValue();
	}
	
	/**
	 * 以object方式存值
	 * @param cacheKey key
	 * @param obj 值
	 */
	public static void putOpsObject(String cacheKey,Object obj){
		opsForValue().set(formatObjectName(cacheKey), obj);
	}
	
	public static Object getOpsObject(String cacheKey){
		return opsForValue().get(formatObjectName(cacheKey));
	}
	

	/**
	 * 以List的方式存放值
	 * @param cacheKey list集合的名称(缓存名)
	 * @param value 存放的值
	 * @return
	 */
	public static Long putBound(String cacheKey,String value){
		return opsForBound(cacheKey).leftPush(value);
	}
	
	public static List<String> getBoundValue(String cacheKey){
		Long size=opsForBound(cacheKey).size();
		List<String> rtnList = new ArrayList<String>();
		for(int i=0;i<size;i++){
			rtnList.add(opsForBound(cacheKey).rightPop());
		}
		return rtnList;
	}

	/**
	 * 以List的方式存放单个Map对象
	 * @param cacheKey list集合的名称(缓存名)
	 * @param args Map对象
	 */
	public static Long putList(String cacheKey, Map<String, Object> args){
		return opsForList().leftPush( formatListName(cacheKey), JSON.toJSONString(args) );
	}

	public static String popList(String cacheKey){
		return opsForList().rightPop(formatListName(cacheKey));
	}

	/**
	 * 以List的方式存放Map对象集合
	 * @param cacheKey list集合的名称(缓存名)
	 * @param args Map对象集合
	 * @return 存放的数量
	 */
	public static Long putList(String cacheKey, List<Map<String, Object>> args){
		long pushNumber = 0;
		if (args != null) {
			for(Map<String, Object> obj : args){
				pushNumber = putList(cacheKey, obj);
			}
		}
		return pushNumber;
	}

	/**
	 * 转换MAP
	 * @param text
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private static Map<String, Object> toMap(String text){
		return JSONObject.parseObject(text, Map.class);
	}

	/**
	 * 获取List集合指定条件的Map集合
	 * @param cacheKey 缓存名
	 * @param where 条件, Map格式: String 是集合中字段名，Object是字段值
	 * @return
	 */
	public static List<Map<String, Object>> getMapList(String cacheKey, Map<String, Object> where){
		return getMapList(cacheKey, where, null);
	}

	/**
	 * 获取List集合指定条件的Map集合
	 * @param cacheKey 缓存名
	 * @param where 条件, Map格式: String 是集合中字段名，Object是字段值
	 * @param fields 查询的字段集合
	 * @return
	 */
	public static List<Map<String, Object>> getMapList(String cacheKey, Map<String, Object> where, List<String> fields){
		ListOperations<String, String> opsForList = opsForList();
		List<Map<String, Object>> retMapList = new ArrayList<Map<String, Object>>();
		Map<String, Object> findMap = null;
		Map<String, Object> retMap = null;

		// 缓存名处理
		cacheKey = formatListName(cacheKey);

		long listSize = opsForList.size(cacheKey);
		long number = 0;
		String value1 = null;
		String value2 = null;
		List<String> list = opsForList.range(cacheKey, 0, listSize-1);

		for(int i = 0; i < listSize; i++){
			number = 0;
			findMap = toMap( list.get(i) );
			for (Entry<String, Object> entry : where.entrySet()){
				value1 = Tools.toStr( entry.getValue(), "" );
				value2 = Tools.toStr( findMap.get(entry.getKey()));
				if( value1.equals(value2) ){
					number++;
				}
			}
			if (number == where.entrySet().size()){
				if (fields != null && fields.size() > 0){
					retMap = new LinkedHashMap<String, Object>();
					for(String field : fields){
						retMap.put(field, findMap.get(field));
					}
					retMapList.add(retMap);
				} else {
					retMapList.add(findMap);
				}
			}
		}
		return retMapList;
	}

	/**
	 * 获取List缓存集合中指定条件的的Map对象
	 * @param cacheKey 缓存名
	 * @param where 条件, Map格式: String 是集合中字段名，Object是字段值
	 * @param fields 查询的字段集合
	 * @return 
	 */
	public static Map<String, Object> getMap(String cacheKey, Map<String, Object> where, List<String> fields){
		return getMap(cacheKey, where, fields.toArray(new String[0]));
	}

	/**
	 * 获取List缓存集合中指定条件的的Map对象
	 * @param cacheKey 缓存名
	 * @param where 条件, Map格式: String 是集合中字段名，Object是字段值
	 * @param fields 查询的字段集合
	 * @return
	 */
	public static Map<String, Object> getMap(String cacheKey, Map<String, Object> where, String... fields){
		ListOperations<String, String> opsForList = opsForList();
		Map<String, Object> findMap = null;
		Map<String, Object> retMap = null;

		// 缓存名处理
		cacheKey = formatListName(cacheKey);

		long listSize = opsForList.size(cacheKey);
		long number = 0;
		String value1 = null;
		String value2 = null;
		List<String> list = opsForList.range(cacheKey, 0, listSize-1);

		for(int i = 0; i < listSize; i++){
			number = 0;
			findMap = toMap( list.get(i) );
			for (Entry<String, Object> entry : where.entrySet()){
				value1 = Tools.toStr( entry.getValue(), "" );
				value2 = Tools.toStr( findMap.get(entry.getKey()));
				if( value1.equals(value2) ){
					number++;
				}
			}
			if (number == where.entrySet().size()){
				if (fields != null && fields.length > 0){
					retMap = new LinkedHashMap<String, Object>();
					for(String field : fields){
						retMap.put(field, findMap.get(field));
					}
					return retMap;
				} else {
					return findMap;
				}
			}
		}
		return null;
	}

	/**
	 * 获取List缓存集合中获取指定条件的指定字段值
	 * @param cacheKey 缓存名
	 * @param where 条件, Map格式: String 是集合中字段名，Object是字段值
	 * @param field 查询的字段名
	 * @return 
	 */
	public static Object getObject(String cacheKey, Map<String, Object> where, String field){
		ListOperations<String, String> opsForList = opsForList();
		Map<String, Object> findMap = null;

		// 缓存名处理
		cacheKey = formatListName(cacheKey);

		long listSize = opsForList.size(cacheKey);
		long number = 0;
		String value1 = null;
		String value2 = null;
		List<String> list = opsForList.range(cacheKey, 0, listSize-1);

		for(int i = 0; i < listSize; i++){
			number = 0;
			findMap = toMap(list.get(i));
			for (Entry<String, Object> entry : where.entrySet()){
				value1 = Tools.toStr( entry.getValue(), "" );
				value2 = Tools.toStr( findMap.get(entry.getKey()));
				if( value1.equals(value2) ){
					number++;
				}
			}
			if (number == where.entrySet().size()){
				return findMap.get(field);
			}
		}
		return null;
	}

	/**
	 * 已Hash方式存放数据
	 * @param cacheKey 缓存名
	 * @param key 唯一标示
	 * @param value 存放的值
	 */
	public static void putHash(String cacheKey, String key, Object value){
		redisTemplate.opsForHash().put(formatHashName(cacheKey), key, Tools.toStr(value));
	}

	/**
	 * 已Hash方式存放数据
	 * @param cacheKey 缓存名
	 * @param keys KEY标识组
	 * @param filedNames 字段名称组:filedNames长度=1则只存放该字段值
	 * @param data 数据源：如果map中只有一个键值对则只存放该键值对的值
	 * @return 结果true/false
	 * @throws Exception
	 */
	public static boolean putHash(String cacheKey, String[] keys, String[] filedNames, List<Map<String, Object>> data) throws Exception{
		if (keys == null || keys.length == 0) throw new RuntimeException("缓存标识不能为空!");
		if (data == null) throw new RuntimeException("缓存数据不能为NULL!");
		if (data.size() > 0) {
			Map<String, Object> tempMap = null;
			String[] temp = new String[keys.length];
			Object value = null;

			for(Map<String, Object> map : data){
				// 生成KEY值
				for(int i=0; i<keys.length; i++){
					temp[i] = String.valueOf(map.get(keys[i]));
				}

				// 过滤VALUE值
				if (filedNames == null || filedNames.length == 0){
					if (map.keySet().size() == 1){
						value = map.get(map.keySet().iterator().next());
					} else {
						value = JSON.toJSONString(map);
					}
				} else if(filedNames.length == 1) {
					value = map.get(filedNames[0]);
				} else {
					tempMap = new LinkedHashMap<String, Object>();
					for(String filedName : filedNames){
						tempMap.put(filedName, map.get(filedName));
					}
					value = JSON.toJSONString(tempMap);
				}
				// 存放到缓存
				putHash(cacheKey, getKey(temp), value);
			}
			return true;
		}
		return false;
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param key 查询的KEY值
	 * @return Object
	 */
	public static Object getObject(String cacheKey, Object key){
		return redisTemplate.opsForHash().get( formatHashName(cacheKey), key.toString() );
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param keys 查询的KEY值组
	 * @return Object
	 */
	public static Object getObject(String cacheKey, Object[] keys){
		return redisTemplate.opsForHash().get( formatHashName(cacheKey), getKey(keys) );
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param key 查询的KEY值
	 * @param filedNames 查询的字段名称组
	 * @return 直接返回该字段值(Object)
	 */
	public static Object getObject(String cacheKey, Object key, String filedName){
		return getObject(cacheKey, new Object[]{key}, filedName);
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param keys 查询的KEY值组
	 * @param filedName 查询的字段名称
	 * @return 直接返回该字段值(Object)
	 */
	public static Object getObject(String cacheKey, Object[] keys, String filedName){
		Map<String, Object> map = getHashMap(cacheKey, keys, new String[]{filedName});
		return map == null ? map : map.get(filedName);
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param key 查询的KEY值
	 * @param filedNames 查询的字段名称组
	 * @return 
	 */
	public static Map<String, Object> getHashMap(String cacheKey, Object key){
		return getHashMap(cacheKey, new Object[]{key}, null);
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param key 查询的KEY值
	 * @param filedNames 查询的字段名称组
	 * @return 
	 */
	public static Map<String, Object> getHashMap(String cacheKey, Object[] keys){
		return getHashMap(cacheKey, keys, null);
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param key 查询的KEY值
	 * @param filedNames 查询的字段名称组
	 * @return 
	 */
	public static Map<String, Object> getHashMap(String cacheKey, Object key, String[] filedNames){
		return getHashMap(cacheKey, new Object[]{key}, filedNames);
	}

	/**
	 * 获取Hash缓存数据
	 * @param cacheKey 缓存名
	 * @param keys 查询的KEY值组
	 * @param filedNames 查询的字段名称组
	 * @return 
	 */
	@SuppressWarnings("unchecked")
	public static Map<String, Object> getHashMap(String cacheKey, Object[] keys, String[] filedNames){
		Object data = getObject(cacheKey, keys);
		if (data == null) return null;
		try {
			JSONObject json = JSON.parseObject(data.toString());
			Map<String, Object> mapData = (Map<String, Object>)JSON.toJavaObject(json, Map.class);
			Map<String, Object> tempMap = new LinkedHashMap<String, Object>();

			if (filedNames == null || filedNames.length == 0){
				return mapData;
			}

			for(String filedName : filedNames){
				tempMap.put(filedName, mapData.get(filedName));
			}
			return tempMap;
		} catch (Exception ex){
			throw new RuntimeException("数据[" + data + "]格式错误!");
		}
	}

	private static String getKey(Object[] keys){
		String key = "";
		for(Object _key : keys){
			if (_key == null){
				throw new RuntimeException("无效的KEY值!");
			}
			key += _key.toString() + "_";
		}
		return key.substring(0, key.length()-1);
	}
}
