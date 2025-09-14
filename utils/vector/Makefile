include $(TOPDIR)/rules.mk

PKG_NAME:=vector
PKG_VERSION:=0.49.0
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE_HEADER:=$(PKG_NAME)-$(PKG_VERSION)-$(ARCH)
PKG_SOURCE_BODY:=unknown-linux-musl
PKG_SOURCE_FOOTER:=tar.gz
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_HEADER)-$(PKG_RELEASE)

ifeq ($(ARCH),x86_64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=e23d2b8fe26fa41b9fbcccb34a32bb144162ccc06eb3867b7aa5de547be9feb9
else ifeq ($(ARCH),aarch64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=8705b0aeaa1e6ba110636674f65b301c2a9873cc4160194ec8fd5ac1b4390a19
else
	PKG_SOURCE_NAME:=dummy
	PKG_SOURCE:=dummy
	PKG_SOURCE_URL:=dummy
	PKG_HASH:=dummy
endif

PKG_LICENSE:=MIT
PKG_MAINTAINER:=icyleaf <icyleaf.cn@gmail.com>

include $(INCLUDE_DIR)/package.mk

STRIP:=true

TAR_CMD=$(HOST_TAR) -C $(1)/ $(TAR_OPTIONS)

define Package/$(PKG_NAME)
	SECTION:=utils
	CATEGORY:=Utilities
	TITLE:=A high-performance observability data pipeline.
	URL:=https://github.com/vectordotdev/vector
	DEPENDS:=@(aarch64||arm||x86_64) @!(i386||mips||mipsel||TARGET_x86_geode||TARGET_x86_legacy)
endef

define Package/$(PKG_NAME)/description
	A high-performance observability data pipeline.
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/conffiles
/etc/config/$(PKG_NAME)
/etc/$(PKG_NAME)/config.yml
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/bin/$(PKG_NAME) $(1)/usr/bin/$(PKG_NAME)

	$(INSTALL_DIR) $(1)/etc/config $(1)/etc/$(PKG_NAME) $(1)/etc/init.d $(1)/etc/uci-defaults
	$(INSTALL_CONF) $(CURDIR)/files/etc/config/$(PKG_NAME) $(1)/etc/config/$(PKG_NAME)
	$(INSTALL_CONF) $(CURDIR)/files/etc/$(PKG_NAME)/config.yml $(1)/etc/$(PKG_NAME)/config.yml
	$(INSTALL_BIN) $(CURDIR)/files/etc/uci-defaults/50_vector $(1)/etc/uci-defaults/50_vector

	$(CP) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/config $(1)/etc/$(PKG_NAME)/config_examples

	$(INSTALL_BIN) $(CURDIR)/files/etc/init.d/$(PKG_NAME) $(1)/etc/init.d/$(PKG_NAME)
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
