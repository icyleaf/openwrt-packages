include $(TOPDIR)/rules.mk

PKG_NAME:=traefik
PKG_VERSION:=2.4.2
PKG_RELEASE:=0.1.1

PKG_SOURCE_PROTO:=git
PKG_SOURCE_URL:=https://github.com/traefik/traefik.git
PKG_SOURCE_VERSION:=f482e5e84a6aa1e5a5bd547883d9c1cb16ba20b0

PKG_SOURCE_SUBDIR:=$(PKG_NAME)
PKG_SOURCE:=$(PKG_SOURCE_SUBDIR)-$(PKG_VERSION)-$(PKG_SOURCE_VERSION).tar.gz
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_SUBDIR)

# PKG_SOURCE:=traefik_v$(PKG_VERSION).src.tar.gz
# PKG_SOURCE_URL:=https://github.com/traefik/traefik/releases/download/v$(PKG_VERSION)
# PKG_HASH:=338df121dded850c43ee957f07d6e6af1bae45d4735egsa5975ed9b5b44725a1e8

PKG_BUILD_DEPENDS:=golang/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

GO_PKG:=github.com/traefik/traefik
GO_PKG_LDFLAGS:=-s -w
GO_PKG_LDFLAGS_X:= \
	$(GO_PKG)/version.Version=$(PKG_VERSION)

include $(INCLUDE_DIR)/package.mk
include $(TOPDIR)/feeds/packages/lang/golang/golang-package.mk

define Package/$(PKG_NAME)
	SUBMENU:=Web Servers/Proxies
	SECTION:=net
	CATEGORY:=Network
	TITLE:=Traefik, The Cloud Native Application Proxy
	URL:=https://github.com/traefik/traefik/
endef

define Package/$(PKG_NAME)/description
	Traefik, The Cloud Native Application Proxy
endef

define Build/Prepare
	# tar -xzf $(DL_DIR)/$(PKG_SOURCE) -C $(PKG_BUILD_DIR)
	# unzip -d $(PKG_BUILD_DIR) $(DL_DIR)/$(PKG_SOURCE)
	tar -zxvf $(DL_DIR)/$(PKG_SOURCE) -C $(BUILD_DIR)/$(PKG_NAME) --strip-components 1
	# $(call Build/Prepare/Default)
endef

define Build/Compile
	$(eval GO_PKG_BUILD_PKG:=$(GO_PKG))
	$(call GoPackage/Build/Configure)
	$(call GoPackage/Build/Compile)
	ifeq ($(CONFIG_TROJAN_GO_COMPRESS_UPX),y)
		$(STAGING_DIR_HOST)/bin/upx --lzma --best $(GO_PKG_BUILD_BIN_DIR)/$(PKG_NAME)
	endif
	chmod +wx $(GO_PKG_BUILD_BIN_DIR)/$(PKG_NAME)
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/sbin
	$(INSTALL_BIN) $(GO_PKG_BUILD_BIN_DIR)/$(PKG_NAME) $(1)/usr/sbin/$(PKG_NAME)
endef

$(eval $(call GoBinPackage,$(PKG_NAME)))
$(eval $(call BuildPackage,$(PKG_NAME)))
