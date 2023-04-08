---
title: 线程池
date: 2022-4-15
categories:
 - SpringBoot
tags:
 - SpringBoot
---

# 线程池 异步编排

配置一个自己的线程池

```java
@EnableConfigurationProperties(ThreadPoolConfigProperties.class)
@Configuration
public class MyThreadConfig {

    @Bean
    public ThreadPoolExecutor threadPoolExecutor(ThreadPoolConfigProperties pool) {
        return new ThreadPoolExecutor(
                pool.getCoreSize(),
                pool.getMaxSize(),
                pool.getKeepAliveTime(),
                TimeUnit.SECONDS,
                new LinkedBlockingDeque<>(1000),
                Executors.defaultThreadFactory(),
                // 被拒绝的任务抛出异常
                new ThreadPoolExecutor.AbortPolicy()
        );
    }
}
```

````java
@ConfigurationProperties(prefix = "thread.pool")
@Data
public class ThreadPoolConfigProperties {

    private Integer coreSize;
    private Integer maxSize;
    private Integer keepAliveTime;
}
````

```yaml
thread:
  pool:
    core-size: 20
    max-size: 200
    keep-alive-time: 5
```

异步编排

```java
public ProductDetailVo findByProductId(Long productId) {
    CompletableFuture<ProductDetailVo> infoFuture = CompletableFuture.supplyAsync(() -> {
        // 查询商品信息
        ProductModel model = this.getOne(new QueryWrapper<ProductModel>()
                                         .eq("id", productId)
                                         .eq("is_publish", 1)
                                        );
        Assert.notNull(model, BizExceptionEnum.PRODUCT_NOT_EXIST, "ProductServiceImpl : findById " +
                       "error");
        return ProductDetailVo.fromModel(model);
    }, executor);


    CompletableFuture<Void> attrFuture = infoFuture.thenAcceptAsync((res) -> {
        List<ProductAttrVo> list = new ArrayList<>();
        res.setProductAttrVos(list);
        // 查询商品属性
        List<ProductAttributeValueModel> productAttributeValues =
            productAttributeValueMapper.selectList(new QueryWrapper<ProductAttributeValueModel>().eq(
                "product_id", productId));
        // 查询商品属性名称
        for (ProductAttributeValueModel productAttributeValueModel : productAttributeValues) {
            ProductAttrVo productAttrVo = new ProductAttrVo();
            // 查询属性名称
            ProductAttributeModel productAttributeModel =
                productAttributeMapper.selectOne(new QueryWrapper<ProductAttributeModel>()
                                                 .eq("id",
                                                     productAttributeValueModel.getProductAttributeId())
                                                 .eq("type", 1)
                                                );
            Assert.notNull(productAttributeModel, BizExceptionEnum.PRODUCT_ATTR_NAME_NOT_EXIST);
            // 组合属性名称跟属性值
            productAttrVo.setName(productAttributeModel.getName());
            productAttrVo.setValue(productAttributeValueModel.getValue());
            productAttrVo.setIcon(productAttributeValueModel.getIcon());
            list.add(productAttrVo);
        }
    }, executor);

    CompletableFuture<Void> buyImageFuture = infoFuture.thenAcceptAsync((res) -> {
        // 查询购买页商品图片
        List<ProductBuyImageVo> productBuyImageVoList =
            productBuyImageMapper.selectList(new QueryWrapper<ProductBuyImageModel>().eq(
                "product_id", productId))
            .stream()
            .map(ProductBuyImageVo::fromModel)
            .collect(Collectors.toList());
        res.setBuyImages(productBuyImageVoList);
    }, executor);

    CompletableFuture<Void> specFuture = infoFuture.thenAcceptAsync((res) -> {
        // 查询商品规格
        List<SkuStockVo> skuStockVoList =
            skuStockMapper.selectList(new QueryWrapper<SkuStockModel>().eq(
                "product_id", productId))
            .stream()
            .map(SkuStockVo::fromModel)
            .collect(Collectors.toList());
        res.setSkuStockVos(skuStockVoList);
    }, executor);
    ProductDetailVo productDetailVo = null;
    try {
        // 等待异步任务都完成
        CompletableFuture.allOf(attrFuture, buyImageFuture, specFuture).get();
        productDetailVo = infoFuture.get();
    } catch (InterruptedException | ExecutionException e) {
        Assert.thrown(BizExceptionEnum.PRODUCT_NOT_EXIST);
    }
    return productDetailVo;
}
```
