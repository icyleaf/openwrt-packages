include $(TOPDIR)/rules.mk

PKG_NAME:=helix
PKG_VERSION:=23.10
PKG_RELEASE:=$(AUTORELEASE)

PKG_SOURCE:=$(PKG_NAME)-$(PKG_VERSION)-$(ARCH).tar.xz
PKG_SOURCE_URL:=https://github.com/helix-editor/helix/releases/download/$(PKG_VERSION)/$(PKG_SOURCE)?

PKG_SOURCE_HEADER:=$(PKG_NAME)-$(PKG_VERSION)-$(ARCH).tar.xz
PKG_BUILD_DIR:=$(BUILD_DIR)/$(PKG_SOURCE_HEADER)-$(PKG_RELEASE)

ifeq ($(ARCH),x86_64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=bd4de5edb942083c8d14098f98d875fd23d82dd2e23c3085b8d5030912b5bc97
else ifeq ($(ARCH),aarch64)
	PKG_SOURCE_NAME:=$(PKG_NAME)-$(ARCH)-$(PKG_SOURCE_BODY)
	PKG_SOURCE:=$(PKG_SOURCE_HEADER)-$(PKG_SOURCE_BODY).$(PKG_SOURCE_FOOTER)
	PKG_SOURCE_URL:=https://github.com/vectordotdev/vector/releases/download/v$(PKG_VERSION)/$(PKG_SOURCE)?
	PKG_HASH:=b16e5a5a83df744bac15bb2e22cc14c701a3d3a97d7901584e941776c81a691d
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
	TITLE:=A post-modern modal text editor.
	URL:=https://github.com/helix-editor/helix
	DEPENDS:=@(aarch64||arm||x86_64) @!(i386||mips||mipsel||TARGET_x86_geode||TARGET_x86_legacy)
endef

define Package/$(PKG_NAME)/description
	A post-modern modal text editor.
endef

define Build/Compile
endef

define Package/$(PKG_NAME)/install
	$(INSTALL_DIR) $(1)/usr/bin
	$(INSTALL_BIN) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/hx $(1)/usr/bin/hx

	$(INSTALL_DIR) $(1)/usr/share/$(PKG_NAME)
	$(INSTALL_DIR) $(PKG_BUILD_DIR)/$(PKG_SOURCE_NAME)/runtime /usr/share/$(PKG_NAME)/runtime
endef

$(eval $(call BuildPackage,$(PKG_NAME)))
